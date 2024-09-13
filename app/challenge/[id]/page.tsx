import ChallengeBody from "@/components/ChallengeBody";
import Input from "@/components/Input";
import ChallengeHeader from "@/components/ChallengeHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type Props = {
  params: {
    id: string;
  };
};
async function ChallengePage({ params }: Props) {
  //not in use...
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col h-screen overflow-hidden// overflow-x-hidden ">
      <ChallengeHeader challengeId={params.id} />

      {/* messages(attempt + ai-feedback) + tips + assessment  */}
      <ChallengeBody challengeId={params.id} />

      {/* textarea + buttons + progressbar */}
      <Input challengeId={params.id} />
    </div>
  );
}

export default ChallengePage;
