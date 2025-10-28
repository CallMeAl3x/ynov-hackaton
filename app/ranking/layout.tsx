import Navbar from "@/app/(protected)/_components/navbar";

interface RankingLayoutProps {
  children: React.ReactNode;
}

const RankingLayout = ({ children }: RankingLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default RankingLayout;
