import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Button } from "./ui/button";
import { signIn } from "@/utility/fetch";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react";
import { useAutoSignIn } from "@/hooks/autoSignIn";

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { scheduleAutoSignIn } = useAutoSignIn();

  // Validation functions
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => signIn(email, password),
    onSuccess: async (data) => {
      if (data?.expiresIn) {
        scheduleAutoSignIn(data.expiresIn); 
      }
    },
    onError: (error) => {
      console.error("Sign-in failed:", error);
      alert("Sign-in failed. Please check your credentials and try again.");
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // input validation
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters, include uppercase, lowercase, number, and special character");
      return;
    }

    // Call signIn mutation
    mutation.mutate({ email, password });
  };

  return (
    <form
      className="w-sm h-fit bg-accent p-5 rounded-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Email</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldDescription>
              Inverto email address.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldDescription>
              Inverto password.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button className="w-xs mx-auto" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </FieldSet>
    </form>
  );
}
