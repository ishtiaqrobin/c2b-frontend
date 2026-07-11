"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import IndividualRegisterForm from "./IndividualRegisterForm";
import CorporationRegisterForm from "./CorporationRegisterForm";

export default function MemberRegistration() {
  // State to track selection. Default is undefined (nothing selected)
  const [registrationType, setRegistrationType] = useState<
    "individual" | "corporation" | undefined
  >();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900">
        New Member Registration
      </h1>

      {/* Main Classification Card */}
      <Card className="bg-slate-50/60 border-slate-200 shadow-sm p-0">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Label Area */}
          <div className="space-y-1">
            <Label className="text-base md:text-lg font-semibold text-slate-800">
              Individual corporation classification
            </Label>
            <span className="text-xs text-red-500 font-medium block">
              Required
            </span>
          </div>

          {/* Radio Group Area */}
          <RadioGroup
            value={registrationType}
            onValueChange={(value) =>
              setRegistrationType(value as "individual" | "corporation")
            }
            className="flex flex-col sm:flex-row gap-6 md:mt-1"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="individual"
                id="individual"
                className="w-5 h-5 border-slate-400 text-slate-900"
              />
              <Label
                htmlFor="individual"
                className="cursor-pointer text-slate-700 text-base font-medium"
              >
                individual
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="corporation"
                id="corporation"
                className="w-5 h-5 border-slate-400 text-slate-900"
              />
              <Label
                htmlFor="corporation"
                className="cursor-pointer text-slate-700 text-base font-medium"
              >
                Corporation
              </Label>
            </div>
          </RadioGroup>
        </CardContent>

        {/* Conditional Form Rendering */}
        {registrationType === "individual" && <IndividualRegisterForm />}
        {registrationType === "corporation" && <CorporationRegisterForm />}
      </Card>
    </div>
  );
}
