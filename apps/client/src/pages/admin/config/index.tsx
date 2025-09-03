import {
  DefaultAdminConfigState,
  setAdminConfigOpened,
} from '../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import AdminUserConfig from './admin.user.config';
import './styles/admin.config.styles.main.scss';
import { MdClose } from 'react-icons/md';

interface AdminConfigProps {
  globalStyle: any;
}

const ConfigKey: string = 'admin.config';

export function createAdminConfig(update?: any) {
  localStorage.setItem(
    ConfigKey,
    JSON.stringify({
      ...DefaultAdminConfigState,
      ...update,
    }),
  );
}

export function getAdminConfig(key?: string): any {
  let config: any = localStorage.getItem(ConfigKey);

  // No config found
  if (!config) {
    // Insert a new config
    createAdminConfig();
    // Re-call this function
    return getAdminConfig(key);
  }

  // Parse saved config
  config = JSON.parse(config);

  // Return specific config (if key is presented)
  // Or return the entire config
  return key ? config[key] : config;
}

export default function AdminConfig(props: AdminConfigProps) {
  const state = useSelector((state: RootState) => state.admin_config);
  const dispatch = useDispatch();

  // Global styles
  const { globalStyle } = props;

  return (
    <div
      className={
        state.opened ? 'Admin-Config Admin-Config-Active' : 'Admin-Config'
      }
    >
      <div
        className="Admin-Config-Header"
        style={{ backgroundColor: globalStyle.primaryColor }}
      >
        <h4 className="Admin-Config-Header-Text">Pengaturan</h4>
        <div
          className="Admin-Config-Header-Close-Button"
          onClick={() => dispatch(setAdminConfigOpened(false))}
        >
          <MdClose />
        </div>
      </div>
      <div className="Admin-Config-Body">
        <AdminUserConfig />
      </div>
    </div>
  );
}
