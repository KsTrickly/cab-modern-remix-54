
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminContent } from '@/components/admin/AdminContent';

const Admin = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
