import { Auth } from '@screens/Auth/Auth';

const authPage = () => (
  <div className="p-xxx-l">
    <Auth />
  </div>
);

export default authPage;

export const getServerSideProps = async () => ({
  props: {
    protected: false,
  },
});
