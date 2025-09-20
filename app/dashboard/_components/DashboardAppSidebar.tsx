import * as React from "react";
import { getUserRole } from "../../data/user/get-user-role";
import { DashboardAppSidebarClient } from "./DashboardAppSidebarClient";

export async function AppSidebar(props: Omit<React.ComponentProps<typeof DashboardAppSidebarClient>, 'userRole'>) {
  const userRole = await getUserRole();
  
  return <DashboardAppSidebarClient userRole={userRole || null} {...props} />;
}
