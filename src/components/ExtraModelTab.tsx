
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// This component has been simplified as 3D models on homepage are no longer required
const ExtraModelTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Homepage Display Settings</h3>
            <p className="text-sm text-muted-foreground">
              Settings for the homepage display have been simplified.
            </p>
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Display Configuration</AlertTitle>
              <AlertDescription>
                The 3D model display feature has been removed as requested.
                Product display is now handled directly through the Products tab.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtraModelTab;
