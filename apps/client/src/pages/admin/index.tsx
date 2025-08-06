import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import { useDispatch } from 'react-redux';
import '../../styles/admin/index.scss';
import AdminInsert from './insert';
import { useEffect } from 'react';

interface AdminProps {
  refreshToken: any;
}

export default function Admin(props: AdminProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    /*
    | ------------------------------------------------------------
    | LOGIN PROFILE
    | ------------------------------------------------------------
    | Berisi:
    | iat, exp, sub, role
    | iat = Issued At (where the token is created)
    | exp = Expired
    | sub = No Tlp. User/Admin/Kasir
    | role = User/Admin/Kasir
    */
    // const profile: any = localStorage.getItem('UPK.Login.Profile');
    // const { iat, exp } = JSON.parse(profile);

    // Remove loading animation
    dispatch(rootRemoveLoading());
  }, []);

  return (
    <div className="Admin">
      <h1>Admin page</h1>

      {/* <AdminInsert refreshToken={props.refreshToken} /> */}
    </div>
  );
}
