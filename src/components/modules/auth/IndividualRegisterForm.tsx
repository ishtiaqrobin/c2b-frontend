import { Card, CardContent } from "@/components/ui/card";

export default function IndividualRegisterForm() {
  return (
    <Card className="p-0 bg-slate-50/60 animate-in fade-in slide-in-from-bottom-4 duration-500 border-none">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">
          Individual Registration Form
        </h3>
        <div className="space-y-4">
          {/* Add your individual form inputs here */}
          <p className="text-sm text-slate-500">
            First Name, Last Name, NID, etc. will go here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
