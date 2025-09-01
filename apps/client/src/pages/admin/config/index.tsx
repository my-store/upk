import {
  adminConfigSetUserInsertAutoActivate,
  type UserConfigInterface,
  setAdminConfigOpened,
} from '../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import './styles/admin.config.styles.main.scss';
import { MdClose } from 'react-icons/md';
import { useEffect } from 'react';

interface AdminConfigProps {
  globalStyle: any;
}

interface DefaultConfigInterface {
  user: UserConfigInterface;
}

const DefaultConfig: DefaultConfigInterface = {
  user: {
    insert: {
      autoActivate: true,
    },
  },
};

const ConfigKey: string = 'admin.config';

function createConfig(update?: any) {
  localStorage.setItem(
    ConfigKey,
    JSON.stringify({
      ...DefaultConfig,
      ...update,
    }),
  );
}

function getConfig(key?: string): any {
  let config: any = localStorage.getItem(ConfigKey);

  // No config found
  if (!config) {
    // Insert a new config
    createConfig();
    // Re-call this function
    return getConfig(key);
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

  function updateUserConfig(newConfig: any) {
    const oldConfig: any = getConfig();
    createConfig({ ...oldConfig, user: { ...oldConfig.user, ...newConfig } });
  }

  function applyConfig() {
    // Override | User > isert > autoActivate
    const active = getConfig('user').insert.autoActivate;
    dispatch(adminConfigSetUserInsertAutoActivate(active));
  }

  useEffect(() => {
    applyConfig();
  }, []);

  return (
    <div
      className={
        state.opened ? 'Admin-Config Admin-Config-Active' : 'Admin-Config'
      }
    >
      <div className="Admin-Config-Header">
        <h4 className="Admin-Config-Header-Text">Pengaturan</h4>
        <div
          className="Admin-Config-Header-Close-Button"
          onClick={() => dispatch(setAdminConfigOpened(false))}
        >
          <MdClose />
        </div>
      </div>
      <div className="Admin-Config-Body">
        {/* Config Items */}
        <div className="Admin-Config-Body-Item">
          <p className="Admin-Config-Body-Item-Title">User</p>
          <div className="Admin-Config-Body-Item-Subdata">
            <p className="Admin-Config-Body-Item-Subdata-Label">Insert</p>
            <div className="Admin-Config-Body-Item-Subdata-Value">
              <p className="Admin-Config-Body-Item-Subdata-Value-Label">
                Otomatis Aktivasi
              </p>
              <input
                className="Admin-Config-Body-Item-Subdata-Value-Input"
                defaultChecked={state.user.insert.autoActivate}
                checked={state.user.insert.autoActivate}
                onChange={({ target: { checked } }) => {
                  dispatch(adminConfigSetUserInsertAutoActivate(checked));

                  // User > isert > autoActivate | Update localstorage
                  const userConfig: any = getConfig('user');
                  updateUserConfig({
                    ...userConfig,
                    insert: {
                      ...userConfig.isert,
                      autoActivate: checked,
                    },
                  });
                }}
                type="checkbox"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
