import {
  adminTemplatesSidebarBoxOpen,
  adminTemplatesSidebarOpen,
} from '../../../../../libs/redux/reducers/admin/admin.templates.sidebar.slice';
import './styles/admin.templates.sidebar.update-profile.styles.main.scss';
import type { RootState } from '../../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';

export default function AdminSidebarUpdateProfile() {
  const state = useSelector(
    (state: RootState) => state.admin_templates_sidebar,
  );
  const dispatch = useDispatch();

  return (
    <div
      className={
        state.opened
          ? 'Admin-Sidebar-Update-Profile Admin-Sidebar-Update-Profile-Active'
          : 'Admin-Sidebar-Update-Profile'
      }
      onClick={() => {
        // Remove update profile box
        dispatch(adminTemplatesSidebarBoxOpen(false));

        // Remove update profile container
        dispatch(adminTemplatesSidebarOpen(false));
      }}
    >
      <div
        className={
          state.boxOpened
            ? 'Admin-Sidebar-Update-Profile-Box Admin-Sidebar-Update-Profile-Box-Active'
            : 'Admin-Sidebar-Update-Profile-Box'
        }
      ></div>
    </div>
  );
}
