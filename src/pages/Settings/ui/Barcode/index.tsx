import { useEffect, useState } from "react";
import { PrinterIcon } from "@/shared/ui/icons";
import { useProducts } from "@/entities/product/model/useProducts";
import type { ProductItem } from "@/entities/product/api/types";
import { GenerateBarcode } from "@/shared/ui/GenerateBarcode";
import axios from "axios";
import JsBarcode from "jsbarcode";

import styles from "./Barcode.module.scss";
import { useProfileInfo } from "@/entities/cashier/model/useProfileInfo";

// URL вашего локального сервера печати
const PRINT_SERVER_URL = "http://localhost:31415";

const svgToBase64 = (svgString: string): string => {
  const bytes = new TextEncoder().encode(svgString);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join("");
  return btoa(binString);
};

const Barcode = () => {
  const barcodes = useProducts();
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const profileInfo = useProfileInfo();
  const [storeName, setStoreName] = useState<string>("Magazin");

  useEffect(() => {
    // Безопасная проверка с optional chaining
    const stores = profileInfo.data?.data?.employee?.accessible_stores_info;
    if (stores && stores.length > 0 && stores[0].name) {
      setStoreName(stores[0].name);
    }
  }, [profileInfo.data]);

  // Проверка доступности сервера печати
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios(`${PRINT_SERVER_URL}/status`);

        if (response.status === 200) {
          setServerStatus("online");
          console.log("✅ Сервер печати доступен");
        } else {
          setServerStatus("offline");
        }
      } catch {
        setServerStatus("offline");
        console.error("❌ Сервер печати недоступен. Запустите print-service");
      }
    };

    checkServer();
    // Проверяем каждые 5 секунд
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  const createSVGLabel = (item: ProductItem) => {
    // Генерируем штрихкод с увеличенной шириной
    const tempDiv = document.createElement("div");
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    JsBarcode(svgElement, String(item.barcode), {
      format: "CODE128",
      width: 4, // Увеличиваем толщину линий
      height: 80, // Высота штрихкода
      displayValue: false,
      margin: 0,
    });

    // Устанавливаем ширину SVG штрихкода
    svgElement.setAttribute("width", "520");
    tempDiv.appendChild(svgElement);
    const barcodeContent = tempDiv.innerHTML;

    // Создаем SVG с центрированным длинным штрихкодом
    const svg = `
    <svg width="580" height="400" xmlns="http://www.w3.org/2000/svg" style="font-family: Arial, sans-serif;">
      <!-- Белый фон -->
      <rect width="580" height="400" fill="white"/>
      
      <!-- Название магазина сверху -->
      <text x="290" y="50" font-size="28" font-weight="bold" text-anchor="middle" >
        ${storeName}
      </text>
      
      <!-- Обертка со сдвигом вниз на 40px -->
      <g transform="translate(0, 60)">
        <!-- Цена крупно по центру -->
        <text x="290" y="80" font-size="48" font-weight="bold" text-anchor="middle">
          ${(+item.sale_price).toLocaleString("de-DE")} uzs
        </text>
        
        <!-- Название товара под ценой -->
        <text x="290" y="120" font-size="28" text-anchor="middle">
          ${item.name}
        </text>
        
        <!-- Длинный штрихкод по центру (30px отступ с каждой стороны) -->
        <g transform="translate(30, 160)">
          ${barcodeContent}
        </g>
        
        <!-- Номер штрихкода -->
        <text x="290" y="280" font-size="26" text-anchor="middle">
          ${item.barcode}
        </text>
      </g>
      
      <!-- Размер в кружке справа сверху -->
      <g transform="translate(540, 50)">
        <!-- Круг -->
        <circle cx="0" cy="0" r="35" fill="none" stroke="#333" stroke-width="2"/>
        <!-- Текст размера -->
        <text x="0" y="8" font-size="28" font-weight="bold" text-anchor="middle">
          ${item.size?.size || "-"}
        </text>
      </g>
    </svg>
  `;

    return svg;
  };

  const handlePrint = async (item: ProductItem) => {
    if (serverStatus !== "online") {
      alert("Сервер печати недоступен. Запустите print-server");
      return;
    }

    try {
      const svgString = createSVGLabel(item);

      // Современный способ
      const svgBase64 = svgToBase64(svgString);
      const imageData = `data:image/svg+xml;base64,${svgBase64}`;

      // Отправляем на сервер печати
      const response = await axios.post(`${PRINT_SERVER_URL}/print`, {
        base64Image: imageData,
        printerName: "Xprinter XP-365B", // Можно сделать настраиваемым
        itemInfo: {
          name: item.name,
          barcode: item.barcode,
          price: item.sale_price,
        },
      });

      const result = await response.data;

      if (result.success) {
        console.log("✅ Напечатано:", item.name);

        // Опционально: показать уведомление об успешной печати
        // showNotification('Успешно напечатано');
      } else {
        console.error("❌ Ошибка печати:", result.error);
        alert(`Ошибка печати: ${result.error || "Неизвестная ошибка"}`);
      }
    } catch (err) {
      console.error("❌ Ошибка:", err);
      alert("Ошибка при отправке на печать");
    }
  };

  // Опциональная функция для получения списка принтеров
  // const getPrinters = async () => {
  //   try {
  //     const response = await fetch(`${PRINT_SERVER_URL}/printers`);
  //     const data = await response.json();
  //     return data.printers;
  //   } catch (error) {
  //     console.error("Не удалось получить список принтеров");
  //     return [];
  //   }
  // };

  return (
    <div className={styles.barcode}>
      <h3>
        Bar kod sozlamalari
        {serverStatus === "online" && (
          <span style={{ color: "green" }}> ● Принтер активен</span>
        )}
        {serverStatus === "offline" && (
          <span style={{ color: "red" }}> ● Принтер недоступен</span>
        )}
      </h3>

      {barcodes.data?.data?.results.length === 0 ? (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      ) : (
        <ul className={styles.barcode__list}>
          {barcodes.data?.data?.results.map((item) => (
            <li key={item.id} className={styles.barcode__item}>
              <div className={styles.item__header}>
                <span className={styles.size}>{item.size?.size ?? "-"}</span>
                <span className={styles.price}>
                  {(+item.sale_price).toLocaleString("de-DE")} uzs
                </span>
                <p className={styles.title}>{item.name}</p>
                <GenerateBarcode value={String(item.barcode)} />
                <span className={styles.barcode__id}>{item.barcode}</span>
              </div>

              <div className={styles.item__footer}>
                <h2>{item.name}</h2>
                <span onClick={() => handlePrint(item)}>
                  <PrinterIcon />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Barcode;
