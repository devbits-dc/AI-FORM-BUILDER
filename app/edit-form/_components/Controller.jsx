import React, { useState } from "react";
import Themes from "../../_data/Themes";
import GradientBg from "../../_data/GradientBg";
import Style from "../../_data/Style";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const Controller = ({ selectedTheme, selectedBackground, selectedStyle }) => {
  const [showMore, setShowMore] = useState(6);

  return (
    <div>
      {/* Form Color */}
      <h2 className="my-1">Select Themes</h2>
      <Select onValueChange={(value) => selectedTheme(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme, index) => (
            <SelectItem value={theme.theme} key={index}>
              <div className="flex gap-3">
                <div className="flex">
                  <div
                    className="h-5 w-5 rounded-l-md"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div
                    className="h-5 w-5"
                    style={{ backgroundColor: theme.secondary }}
                  ></div>
                  <div
                    className="h-5 w-5"
                    style={{ backgroundColor: theme.accent }}
                  ></div>
                  <div
                    className="h-5 w-5 rounded-r-md"
                    style={{ backgroundColor: theme.neutral }}
                  ></div>
                </div>
                {theme.theme}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* BackGround Color */}
      <h2 className="mt-8 my-1">Background</h2>
      <div className="grid grid-cols-3 gap-5">
        {GradientBg.map(
          (bg, index) =>
            index < showMore && (
              <div
                key={index}
                onClick={() => selectedBackground(bg.gradient)}
                className="w-full h-[70px] rounded-lg hover:scale-110 hover:duration-300 hover:border-2 hover:border-black flex items-center justify-center"
                style={{ background: bg.gradient }}
              >
                {index == 0 && "None"}
              </div>
            )
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full my-2"
        onClick={() => setShowMore(showMore > 6 ? 6 : 20)}
      >
        {showMore > 6 ? "Show Less" : "Show More"}
      </Button>

      {/* style container */}
      <div>
        <h2>Style</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Style.map((item, index) => (
            <div key={index}>
              <div
                className="cursor-pointer hover:scale-110 hover:duration-300 hover:border-2 rounded-lg"
                onClick={() => selectedStyle(item)}
              >
                <img
                  src={item.img}
                  alt="img"
                  width={600}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-center">{item.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controller;
