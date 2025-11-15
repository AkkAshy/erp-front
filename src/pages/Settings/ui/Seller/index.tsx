import { useEffect, useState } from "react";
import {
  useFilteredUsers,
  useUser,
} from "@/entities/cashier/model/useFilteredUsers";
import { useCreateUser } from "@/entities/cashier/model/useCreateUser";
import { useUpdateUser } from "@/entities/cashier/model/useUpdateUser";
import { useToggleActiveUser } from "@/entities/cashier/model/useActiveUser";
import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";

import { EditIcon, HideIcon, MoreIcon } from "@/shared/ui/icons";
import Table from "@/shared/ui/Table";
import CreateModal from "@/shared/ui/CreateModal";
import SelectGender from "@/shared/ui/SelectGender";
import DashedButton from "@/shared/ui/DashedButton";

import { Checkbox, ConfigProvider } from "antd";

//scss
import styles from "./Seller.module.scss";
import SelectRole from "@/shared/ui/SelectRole";
import { isEmail, isStrongPassword, normalizePhone } from "@/shared/lib/utils";
import { format, useMask } from "@react-input/mask";
import Notification from "@/shared/ui/Notification";

type Gender = "Erkak" | "Ayol" | null;

const maskOptions = {
  mask: "+998 (__) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
};
type RoleItem = {
  label: string;
  role: string;
};
const mapRole: RoleItem[] = [
  {
    label: "sohib",
    role: "owner",
  },
  {
    label: "menedjer",
    role: "manager",
  },
  {
    label: "kassir",
    role: "cashier",
  },
  {
    label: "omborchi",
    role: "stockkeeper",
  },
];

const Seller = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const sellers = useFilteredUsers({ id: "", is_active: isActive });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | string>("");
  const [role, setRole] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const inputRef = useMask(maskOptions);

  const [deleteId, setDeleteId] = useState(0);
  const [updateId, setUpdateId] = useState<string | number>("");

  const toggleActive = useToggleActiveUser();
  const [isToggling, setIsToggling] = useState(false);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const currentUser = useUser({
    id: isOpenUpdate ? updateId : "",
  });

  function clearData() {
    setName("");
    setPhone("");
    setLogin("");
    setPassword("");
    setGender(null);
    setEmail("");
    setError(null);
    setRole(null);
  }

  function handleCreate() {
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to‘g‘ri kiriting");
      return;
    }

    if (!isEmail(email)) {
      setError("Emailni to‘g‘ri kiriting");
      return;
    }

    if (!login.trim()) {
      setError("Loginni kiriting");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Parol katta harf, raqam va kamida 6 ta belgidan iborat bo'lishi kerak"
      );
      return;
    }
    if (!gender) {
      setError("Jinsni tanlang");
      return;
    }
    if (!role) {
      setError("Role tanlang");
      return;
    }
    setError(null);
    const normalizedPhone = normalizePhone(phone);

    createUser
      .mutateAsync({
        username: login,
        password: password,
        first_name: name,
        phone: normalizedPhone,
        sex: gender,
        email,
        role: role || "cashier",
      })
      .then((res) => {
        if (res.status === 201) {
          setIsOpenCreate(false);
          clearData();
        }
        console.log("res", res);
      });
  }

  function handleUpdate() {
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to‘g‘ri kiriting");
      return;
    }

    if (!isEmail(email)) {
      setError("Emailni to‘g‘ri kiriting");
      return;
    }

    if (!login.trim()) {
      setError("Loginni kiriting");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Parol katta harf, raqam va kamida 6 ta belgidan iborat bo'lishi kerak"
      );
      return;
    }
    if (!gender) {
      setError("Jinsni tanlang");
      return;
    }

    setError(null);
    const normalizedPhone = normalizePhone(phone);
    updateUser
      .mutateAsync({
        id: updateId,
        first_name: name,
        phone: normalizedPhone,
        email,
        username: login,
        password: password,
        sex: gender ?? "",
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setIsOpenUpdate(false);
          clearData();
        }
        console.log("res", res);
      });
  }

  function handleDelete(id: number) {
    setIsToggling(true);
    toggleActive
      .mutateAsync({ id, is_active: !isActive })
      .then(() => {
        setIsDeleteModal(false);
        setDeleteId(0);
      })
      .finally(() => {
        setIsToggling(false); // Сбрасываем флаг
      });
  }

  useEffect(() => {
    if (currentUser.data?.data.employee_info) {
      const data = currentUser.data?.data;
      setName(data.first_name ?? "");
      setPhone(
        format(data?.employee_info?.phone.replace(/^\+998/, ""), maskOptions)
      );
      setEmail(data.email ?? "");
      setLogin(data.username ?? "");
      setPassword(data.password ?? "");
      setGender(data.employee_info?.sex ?? "");
    }
  }, [currentUser.data, updateId, isOpenUpdate]);

  return (
    <div className={styles.seller}>
      <div className={styles.header}>
        <h3>Ishchilar sozlamalari</h3>

        <span className={styles.checkbox}>
          <span className={styles.text}>
            {isActive ? "Faol ishchilar" : "Faol emas ishchilar"}
          </span>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#8E51FF", // Зеленый вместо синего
              },
            }}
          >
            <Checkbox
              style={{ transform: "scale(1.8)", borderColor: "red" }}
              className={styles.checkbox__input}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </ConfigProvider>
        </span>
      </div>

      <DashedButton onClick={() => setIsOpenCreate(true)}>
        + Yangi ishchilar qoshish
      </DashedButton>
      <Table
        headCols={[
          "#",
          "Ishchi ismi",
          "Telefon raqami",
          "Role",
          "Login",
          "Parol",
          "",
          "",
        ]}
        bodyCols={sellers.data?.data?.employees?.map((item, index) => ({
          id: item.id,
          key: `${index + 1}.`,
          first_name: item.first_name,
          phone: item.employee_info.phone,
          role: mapRole.find((r) => r.role === item.employee_info.role)?.label,
          login: item.username,
          password: item.password ?? "-",
          content_1: (
            <div
              onClick={() => {
                setUpdateId(item.id);
                setIsOpenUpdate(true);
              }}
            >
              <EditIcon />
            </div>
          ),

          content_2: (
            <div
              onClick={() => {
                setDeleteId(item.id);
                setIsDeleteModal(true);
              }}
            >
              {/* {item.is_active_in_store ? (
                <DeleteIcon />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="5" x="2" y="3" rx="1" />
                  <path d="M4 8v11a2 2 0 0 0 2 2h2" />
                  <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
                  <path d="m9 15 3-3 3 3" />
                  <path d="M12 12v9" />
                </svg>
              )} */}
              <HideIcon
                width={32}
                height={32}
                stroke="#8E51FF"
                selected={!item.is_active_in_store}
              />
            </div>
          ),
        }))}
        headCell={{
          1: {
            className: styles.cell__hash,
          },
          8: {
            className: styles.thead__more,
            content: <MoreIcon />,
          },
        }}
        bodyCell={{
          1: {
            className: styles.row__index,
          },
          7: {
            className: styles.edit__btn,
          },
          8: {
            className: styles.delete__btn,
          },
        }}
        isLoading={sellers.isLoading}
      />
      {sellers.data?.data?.employees?.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}
      <CreateModal
        isOpen={isOpenCreate || isOpenUpdate}
        onClose={() => {
          setIsOpenCreate(false);
          setIsOpenUpdate(false);
          setIsSelected(false);
          clearData();
        }}
        headTitle={isOpenUpdate ? "Ishchi tahrirlash" : "Yangi ishchi qoshish"}
        btnTitle={isOpenUpdate ? "O’zgartirish" : "Yaratish"}
        width={964}
        height={693}
        overflowY="hidden"
        btnWidth={"100%"}
        btnHeight={64}
        onClick={(e) => {
          setIsSelected(false);
          setIsRoleOpen(false);
          e.stopPropagation();
        }}
        btnOnClick={() => {
          if (isOpenUpdate) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Ishchi ismi"
        />
        <div className={styles.form__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Telefon raqami</p>

            <input
              ref={inputRef}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              type="tel"
              placeholder="+998 (__) ___-__-__"
            />
          </div>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Email</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <div className={styles.form__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Login</p>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              type="text"
              placeholder="username"
              autoComplete="off"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Parol</p>
            <div className={styles.password}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="new-password"
              />
              <span
                className={styles.password__icon}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <HideIcon selected={showPassword} />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.form__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Ishchi jinsi</p>

            <SelectGender
              gender={gender}
              isSelected={isSelected}
              setGender={setGender}
              setIsSelected={setIsSelected}
            />
          </div>
          {!isOpenUpdate && (
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Ishchi roli</p>
              <SelectRole
                role={role}
                setRole={setRole}
                setIsRoleOpen={setIsRoleOpen}
                isRoleOpen={isRoleOpen}
              />
            </div>
          )}
        </div>
        <p className={styles.validation__error}>{error}</p>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Ishchi qo'shildi!"
        onOpen={createUser.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Ishchi qo'shilmadi!"
        onOpen={createUser.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Ishchi ma'lumotlari yangilandi!"
        onOpen={updateUser.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Ma'lumotlar yangilanmadi!"
        onOpen={updateUser.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={
          isActive
            ? "Ishchi faoliyati to'xtatildi!"
            : "Ishchi faoliyati qayta tiklandi!"
        }
        onOpen={toggleActive.isSuccess && isToggling}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={
          isActive
            ? "Ishchi faoliyatini to'xtatib bo'lmadi!"
            : "Ishchi faoliyatini tiklab bo'lmadi!"
        }
        onOpen={toggleActive.isError && isToggling}
      />

      {isDeleteModal && (
        <DeleteConfirmModal
          onClick={() => handleDelete(deleteId)}
          setIsDeleteModal={setIsDeleteModal}
        />
      )}
    </div>
  );
};

export default Seller;
