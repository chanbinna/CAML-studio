"use client";
import React from "react";
import { Button, useDocumentInfo } from "@payloadcms/ui";

export const ExportSingleWorkshopButton = () => {
  const { id } = useDocumentInfo();

  const handleExport = async () => {
    if (!id) return alert("No workshop found.");

    const res = await fetch(`/api/export-reservations?reservationId=${id}`);
    if (!res.ok) return alert(`Export failed: ${await res.text()}`);

    const blob = await res.blob();

    // ✅ 서버에서 지정한 파일명 추출
    const disposition = res.headers.get("Content-Disposition");
    const match = disposition?.match(/filename="(.+)"/);
    const fileName = match ? match[1] : `workshop-${id}-attendees.csv`;

    // ✅ 다운로드 처리
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // ✅ 서버 파일명 그대로 사용
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: "0rem" }}>
      <Button onClick={handleExport} size='medium'>
        ⬇ Export Attendees CSV
      </Button>
    </div>
  );
};
