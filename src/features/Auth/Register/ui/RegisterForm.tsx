import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegister } from "../api/useRegister";
import Loader from "@/shared/ui/Loader";
import { HideIcon } from "@/shared/ui/icons";

//scss
import styles from "./RegisterForm.module.scss";
import { useMask } from "@react-input/mask";
import { normalizePhone } from "@/shared/lib/utils";

const maskOptions = {
  mask: "+998 (__) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
};
export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const register = useRegister();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const location = useLocation();

  const phoneRef = useMask(maskOptions);
  const storePhoneRef = useMask(maskOptions);

  const handleSubmit = () => {
    const normalizedPhone = normalizePhone(phone);
    const normalizedStorePhone = normalizePhone(storePhone);
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !phone ||
      !storeName ||
      !storeAddress ||
      !storePhone
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (password.length < 8) {
      alert("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }

    register.mutate(
      {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        owner_phone: normalizedPhone,
        store_name: storeName,
        store_address: storeAddress,
        store_phone: normalizedStorePhone,
        store_description: storeDescription,
      },
      {
        onSuccess: () => {
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        },
        onError: (error) => {
          alert("Ro'yxatdan o'tishda xatolik yuz berdi");
          console.error(error);
        },
      }
    );
  };

  return (
    <div className={styles.reg}>
      <div className={styles.reg__inner}>
        <h3>Ro'yxatdan o'tish</h3>

        <div className={styles.sections__wrapper}>
          <div className={styles.section}>
            <h4>Shaxsiy ma'lumotlar</h4>

            <div className={styles.input__wrapper}>
              <label htmlFor="firstName">Ism *</label>
              <input
                type="text"
                id="firstName"
                placeholder="Ismingiz"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="lastName">Familiya</label>
              <input
                type="text"
                id="lastName"
                placeholder="Familiyangiz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="username">Login *</label>
              <input
                type="text"
                id="username"
                placeholder="Foydalanuvchi nomi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                placeholder="email@misol.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="pass">Parol *</label>

              <div className={styles.password}>
                <input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Kamida 6 ta belgi"
                  required
                />
                <span
                  className={styles.password__icon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <HideIcon selected={showPassword} />
                </span>
              </div>
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="phone">Telefon raqam *</label>
              <input
                ref={phoneRef}
                type="tel"
                id="phone"
                placeholder="+998 (__) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h4>Do'kon ma'lumotlari</h4>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeName">Do'kon nomi *</label>
              <input
                type="text"
                id="storeName"
                placeholder="Do'koningiz nomi"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeAddress">Do'kon manzili *</label>
              <input
                type="text"
                id="storeAddress"
                placeholder="Ko'cha, tuman, shahar"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storePhone">Do'kon telefoni *</label>
              <input
                ref={storePhoneRef}
                type="tel"
                id="storePhone"
                placeholder="+998 (__) ___-__-__"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeEmail">Do'kon email</label>
              <input
                type="email"
                id="storeEmail"
                placeholder="dokon@misol.com"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeDescription">Do'kon tavsifi</label>
              <textarea
                id="storeDescription"
                placeholder="Do'kon haqida qisqacha..."
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <p className={styles.required__note}>* Majburiy maydonlar</p>

        <button onClick={handleSubmit} className={styles.btn__submit}>
          {register.isPending ? (
            <Loader color="#fff" size={25} />
          ) : (
            "Ro'yxatdan o'tish"
          )}
        </button>

        <div className={styles.login__link}>
          <p>
            Hisobingiz bormi? <Link to="/auth">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
