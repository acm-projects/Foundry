import React from 'react'
import { ReactFlow, Background as FlowBackground, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EC2InstanceConfigMenu from "@/app/components/EC2InstanceConfigMenu";
import RDSConfigMenu from "@/app/components/RDSConfigMenu";
import S3BucketConfigMenu from "@/app/components/S3BucketConfigMenu";
import DynamoDBConfigMenu from '@/app/components/DynamoDBConfigMenu';

export default function Canvas({ params }) {
 

  return (

    <div className = "h-screen w-full flex justify-center">
    <div className="h-6/7 w-7/7">
      <ReactFlow
       
        fitView
        className="border rounded"
      >
        <FlowBackground />
        <Controls />
      </ReactFlow>
    </div>
    <div>
      <S3BucketConfigMenu></S3BucketConfigMenu>
      <EC2InstanceConfigMenu></EC2InstanceConfigMenu>
      <RDSConfigMenu></RDSConfigMenu>
      <DynamoDBConfigMenu></DynamoDBConfigMenu>
    </div>
    </div>
  );
}
