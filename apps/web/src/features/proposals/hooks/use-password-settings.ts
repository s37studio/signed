import { useState } from "react";

export function usePasswordSettings(
  onPasswordChange: (password: string | null) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    onPasswordChange(newPassword || null);
    setIsEditing(false);
    setNewPassword("");
  };

  const handleRemove = () => {
    onPasswordChange(null);
    setIsEditing(false);
    setNewPassword("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPassword("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    isEditing,
    newPassword,
    showPassword,
    setIsEditing,
    setNewPassword,
    handleSave,
    handleRemove,
    handleCancel,
    toggleShowPassword,
  };
}
