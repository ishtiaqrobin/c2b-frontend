"use client";

import { useState } from "react";
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
      {/* Account Type Selector */}
      <div className="w-full bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <Label className="text-sm leading-4 font-medium text-primary">
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
                className="w-5 h-5 border-zinc-300 dark:border-zinc-600 text-primary"
              />
              <Label
                htmlFor="individual"
                className="cursor-pointer text-text-primary text-base font-medium"
              >
                Individual
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="corporation"
                id="corporation"
                className="w-5 h-5 border-zinc-300 dark:border-zinc-600 text-primary"
              />
              <Label
                htmlFor="corporation"
                className="cursor-pointer text-text-primary text-base font-medium"
              >
                Corporation
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Conditional Form Rendering */}
      {registrationType === "individual" && <IndividualRegisterForm />}
      {registrationType === "corporation" && <CorporationRegisterForm />}
    </div>
  );
}
