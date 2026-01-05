"use client"

import { useState } from "react"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile, updatePassword, uploadAvatar } from "@/app/dashboard/profile/actions"

interface ProfileFormProps {
    user: User
    profile: {
        full_name?: string | null
        email?: string | null
        avatar_url?: string | null
    } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "")

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        const formData = new FormData(e.currentTarget)
        const result = await updateProfile(formData)

        if (result?.error) {
            setMessage(result.error)
        } else {
            setMessage("Profile updated successfully!")
        }
        setIsLoading(false)
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        const formData = new FormData(e.currentTarget)
        const result = await updatePassword(formData)

        if (result?.error) {
            setMessage(result.error)
        } else {
            setMessage("Password updated successfully!")
            e.currentTarget.reset()
        }
        setIsLoading(false)
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        setMessage("")

        // Preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        const formData = new FormData()
        formData.append("avatar", file)
        const result = await uploadAvatar(formData)

        if (result?.error) {
            setMessage(result.error)
        } else {
            setMessage("Avatar updated successfully!")
        }
        setIsLoading(false)
    }

    const name = profile?.full_name || user.email?.split('@')[0] || 'User'
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-3 rounded-md ${message.includes('error') || message.includes('not') ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
                    {message}
                </div>
            )}

            {/* Avatar Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                    <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarPreview} alt={name} />
                        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            disabled={isLoading}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            JPG, PNG or GIF (MAX. 2MB)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                defaultValue={profile?.full_name || ""}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email || ""}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                id="new_password"
                                name="new_password"
                                type="password"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
