import ClientComponent from "./clientComponent";

export default async function Page({params}){
  const data = await params;
  return (
    <ClientComponent params={data} />
  )
}