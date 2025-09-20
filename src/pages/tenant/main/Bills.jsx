import BillsTemplate from "../../templates/tenant/main/BillsTemplate"
import { useState } from "react";

export default function Bills(){
    const [activeTab, setActiveTab] = useState("공과금"); // '공과금' | '공동 관리비'

    return (<BillsTemplate activeTab={activeTab} setActiveTab={setActiveTab}/>)
}