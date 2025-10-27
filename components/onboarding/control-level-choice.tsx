"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Sliders } from "lucide-react";

interface ControlLevelChoiceProps {
  onChoose: (controlLevel: "ai-guided" | "manual") => void;
  isLoading?: boolean;
}

export const ControlLevelChoice = ({ onChoose, isLoading = false }: ControlLevelChoiceProps) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create Your First Story</h1>
        <p className="text-gray-600">How much control do you want over your story creation?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI-Guided Path */}
        <Card
          className="p-6 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all border-2 hover:border-purple-400"
          onClick={() => !isLoading && onChoose("ai-guided")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">AI-Powered Journey</h2>
              <p className="text-gray-600 text-sm">
                Let our AI create your story. Just describe your idea and we'll generate the rest!
              </p>
            </div>

            <div className="w-full space-y-2 text-left text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full" />
                <span>Describe your concept</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full" />
                <span>AI generates the story</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full" />
                <span>Review and publish</span>
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Let AI Create It"}
            </Button>
          </div>
        </Card>

        {/* Manual Path */}
        <Card
          className="p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all border-2 hover:border-blue-400"
          onClick={() => !isLoading && onChoose("manual")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Sliders className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Full Control</h2>
              <p className="text-gray-600 text-sm">
                Build your story step by step. Set up characters, themes, and plot details your way.
              </p>
            </div>

            <div className="w-full space-y-2 text-left text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Set story details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Create characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Write episodes</span>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Build It Myself"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
