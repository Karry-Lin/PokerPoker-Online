"use client";
import {useSyncUserFromCookies} from "@/app/stores/userStore.js";

export default function ClientCookie() {
  useSyncUserFromCookies();
  return <div></div>;
}
