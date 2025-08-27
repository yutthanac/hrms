// src/components/ui/card.jsx
import React from "react";
import clsx from "clsx";

/** <Card> ห่อเนื้อหา */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 shadow-sm bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** <CardHeader> ส่วนหัว */
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx("p-4 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  );
}

/** <CardTitle> ใช้ใน Header */
export function CardTitle({ className, children }) {
  return (
    <h2 className={clsx("text-lg font-semibold", className)}>{children}</h2>
  );
}

/** <CardContent> เนื้อหาหลัก */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx("p-4", className)} {...props}>
      {children}
    </div>
  );
}
