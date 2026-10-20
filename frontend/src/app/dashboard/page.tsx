"use client";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { SidebarDemo } from "./layouts/Sidebar";
import { CMSManager } from "./components/CMSManager";
import { DashboardFeedbackProvider } from "./components/DashboardFeedback";

export default function DashboardPage() {
  const cmsManager = CMSManager();

  return (
    <ProtectedRoute>
      <DashboardFeedbackProvider>
        <SidebarDemo 
          activeSection={cmsManager.activeSection}
          onSectionChange={cmsManager.setActiveSection}
        >
          {cmsManager.content}
        </SidebarDemo>
      </DashboardFeedbackProvider>
    </ProtectedRoute>
  );
}
