"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import IndividualRegisterForm from "./IndividualRegisterForm";
import CorporationRegisterForm from "./CorporationRegisterForm";

type RegistrationType = "individual" | "corporation";

export default function MemberRegistration() {
  const [registrationType, setRegistrationType] =
    useState<RegistrationType | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Classification Card */}
      <Card className="bg-slate-50/60 border-slate-200 shadow-sm p-0 mb-6">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <Label className="text-base md:text-lg font-semibold text-slate-800">
              Account Type
            </Label>
            <span className="text-xs text-red-500 font-medium block">
              Required
            </span>
          </div>

          <RadioGroup
            value={registrationType ?? ""}
            onValueChange={(value) =>
              setRegistrationType(value as RegistrationType)
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
                Individual
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
      </Card>

      {/* Conditional Form Rendering */}
      {registrationType === "individual" && <IndividualRegisterForm />}
      {registrationType === "corporation" && <CorporationRegisterForm />}
    </div>
  );
}
