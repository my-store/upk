import { JSONPost } from '../../libs/redux/requests';

interface Props {
  access_token: string;
  tlp: string;
  refreshToken: any;
}

export default function AdminInsert(props: Props) {
  const { refreshToken, access_token, tlp } = props;

  async function insert() {
    const data = new FormData();
    data.append('', '');

    // Insert data
    const req = await JSONPost('/api/admin', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: data,
    });

    // Token expired
    if (req.message && req.statusCode == 401) {
      refreshToken(tlp);

      // Recall this function
      return insert();
    }
  }

  function validate() {}

  function listenChange() {}

  return <div className="Admin-Insert"></div>;
}
