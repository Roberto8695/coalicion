"use client";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { SidebarDemo } from "./layouts/Sidebar";
import { CMSManager } from "./components/CMSManager";

export default function DashboardPage() {
  const cmsManager = CMSManager();

  return (
    <ProtectedRoute>
      <SidebarDemo 
        activeSection={cmsManager.activeSection}
        onSectionChange={cmsManager.setActiveSection}
      >
        {cmsManager.content}
      </SidebarDemo>
    </ProtectedRoute>
  );
}