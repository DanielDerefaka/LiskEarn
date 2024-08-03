import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import MapBounties from "./MapBounties";

const BountySec = () => {
  return (
    <div className="mt-5">
      <Tabs defaultValue="open">
        <TabsList className=" ">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <div className="border-b-[1px] border-gray-500 rounded"></div>
        <TabsContent value="open">
         <MapBounties/>
         <MapBounties/>
         <MapBounties/>
         <MapBounties/>
         <MapBounties/>
         <MapBounties/>
         <MapBounties/>
        </TabsContent>
        <TabsContent value="review"></TabsContent>
        <TabsContent value="completed"></TabsContent>
      </Tabs>
    </div>
  );
};

export default BountySec;
