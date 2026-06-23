/* eslint-disable @next/next/no-img-element */
"use client";
import Form from "next/form";
import Image from "next/image";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { login } from "./auth/actions";

const LoginPage = () => {
  return (
    <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden filled">
      <div className="flex flex-column align-items-center justify-content-center p-5 gap-3 card">
        <div className="text-center">
          <Image
            src="/assets/image_login.jpg"
            alt="Logo"
            width={120}
            height={120}
            priority
            unoptimized
          />
          <div className="text-900 text-3xl font-medium mb-3">
            Bem vindo(a)!
          </div>
        </div>

        <Form action={login}>
          <div className="flex flex-column gap-2 w-full">
            <label
              htmlFor="email"
              className="block text-900 text-xl font-medium mb-2"
            >
              Email
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full md:w-30rem mb-5 p-3"
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium text-xl mb-2"
            >
              Senha
            </label>
            <Password
              inputId="password"
              name="password"
              placeholder="••••••••"
              feedback={false}
              toggleMask
              className="w-full mb-5"
              inputClassName="w-full p-3 md:w-30rem"
            ></Password>

            <Button
              label="Entrar"
              className="w-full p-3 text-xl"
              type="submit"
            ></Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
