import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

export default function StudyTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Could add notification here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const setPresetTime = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTime(seconds);
    setIsRunning(false);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">Study Timer</CardTitle>
          <Button variant="ghost" size="sm" className="text-text-gray hover:text-gray-900">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {formatTime(time)}
          </div>
          <p className="text-text-gray text-sm">Pomodoro Session</p>
        </div>
        
        {/* Preset buttons */}
        <div className="flex justify-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetTime(25)}
            className={`text-xs ${initialTime === 25 * 60 ? 'bg-medical-blue text-white' : ''}`}
          >
            25m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetTime(15)}
            className={`text-xs ${initialTime === 15 * 60 ? 'bg-medical-blue text-white' : ''}`}
          >
            15m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetTime(5)}
            className={`text-xs ${initialTime === 5 * 60 ? 'bg-medical-blue text-white' : ''}`}
          >
            5m
          </Button>
        </div>
        
        {/* Control buttons */}
        <div className="flex space-x-2 justify-center">
          {!isRunning ? (
            <Button 
              onClick={handleStart}
              className="bg-medical-green text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
              disabled={time === 0}
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              variant="outline"
              className="border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
          )}
          
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-medical-blue h-2 rounded-full transition-all duration-1000" 
              style={{ 
                width: `${((initialTime - time) / initialTime) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {time === 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎉 Session complete! Time for a break.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
