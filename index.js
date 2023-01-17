import Login from "./login";
import { getSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.css';

function Surveillhanz() {
  return (
    <div>
      <Login/>
    </div>
  );
}
export default Surveillhanz;

// Redirect to Dashboard page when you are already authenticated
export async function getServerSideProps({req}) {
  const session = await getSession({req})

  if (!session) {
    return {
      props: { session }
    }
  }

  return {
    redirect: {
      destination: '/Dashboard',
      permanent: false
    }
  }
}