
import React, { useState } from 'react';
import ModelManager from './ModelManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ExtraModelTab = () => {
  const [activeTab, setActiveTab] = useState("models");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="models" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">3D Models</TabsTrigger>
          <TabsTrigger value="homepage">Homepage Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="mt-6">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="homepage" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Homepage Display Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Set models as featured to display them on the homepage. You can manage 3D models in the Models tab.
                </p>
                <p className="text-sm font-medium">
                  All models marked as "Featured" in the Models tab will appear on the homepage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExtraModelTab;
