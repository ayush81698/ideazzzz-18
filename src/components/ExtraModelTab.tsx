
import React, { useState } from 'react';
import ModelManager from './ModelManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>Upload 3D Models</AlertTitle>
            <AlertDescription>
              You can upload 3D model files (.glb or .gltf) directly from your computer. 
              Models marked as "Featured" will appear on the homepage.
            </AlertDescription>
          </Alert>
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
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle>How models are displayed</AlertTitle>
                  <AlertDescription>
                    Models are positioned automatically on the homepage in a visually appealing arrangement.
                    You can customize the position, scale, and rotation of each model in the Models tab.
                  </AlertDescription>
                </Alert>
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
