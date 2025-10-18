"use client";
import {Clock, Activity } from "lucide-react";
import Switch from "./logSwitch";
import EC2log from "./serviceLogs/ec2Log";
import S3Log from "./serviceLogs/s3Log";
import RDSlog from "./serviceLogs/rdsLog";
import axios from "axios";
import DynamoLog from "./serviceLogs/dynamoLog";
import {useState,useEffect} from "react"
import InfraLog from "./serviceLogs/infraLog";
export default function ActivityLogging({params}) {
  

    const [selected, setSelected] = useState('activity');

    const handleChange = (type) => { 
setSelected(type)

    }

console.log("something is chosen",selected)
  return (

<div>


      
<div className = "ml-20 mt-8">
<Switch selected={selected} onChange = {handleChange}  className = "ml-20"/>
</div>

{selected === 'activity' ? <InfraLog/> :<div> <DynamoLog/> <EC2log/></div>}







    </div>
  );
}
