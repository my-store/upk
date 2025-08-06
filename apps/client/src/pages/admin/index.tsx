import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import { useDispatch } from 'react-redux';
import '../../styles/admin/index.scss';
import { useEffect } from 'react';

export default function Admin() {
  const dispatch = useDispatch();

  // const [time, setTime] = useState(0);
  // function tokenCountDown(iat: number, exp: number) {
  //   let t = exp - iat;
  //   function update() {
  //     if (t < 5) {
  //       clearInterval(timer);
  //       return window.location.reload();
  //     }
  //     setTime(t);
  //     t--;
  //   }
  //   const timer = setInterval(update, 1000);
  // }

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

    const profile: any = localStorage.getItem('UPK.Login.Profile');
    const { iat, exp } = JSON.parse(profile);

    // tokenCountDown(iat, exp);

    // Remove loading animation after 3 second
    dispatch(rootRemoveLoading());
    // setTimeout(() => dispatch(rootRemoveLoading()), 3000);

    // SOON
    // Simpan login profile pada login state/redux
  }, []);

  return (
    <div className="Admin">
      <h1>Admin page {time}</h1>
    </div>
  );
}
