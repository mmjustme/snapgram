import React from "react";

import { Button } from "@/components/ui/button";

function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}

const AuthLayout = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default AuthLayout;
