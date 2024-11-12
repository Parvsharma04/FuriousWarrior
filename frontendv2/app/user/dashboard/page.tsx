'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">User Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewContent />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersContent />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsContent />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OverviewContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have 3 recent orders.</p>
          <Button className="mt-4">View All Orders</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have 2 documents available for download.</p>
          <Button className="mt-4">View All Documents</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function OrdersContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Here you can view your order history and track current orders.</p>
        <Button className="mt-4">View Order History</Button>
      </CardContent>
    </Card>
  )
}

function DocumentsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Access and download your purchased documents here.</p>
        <Button className="mt-4">Download All Documents</Button>
      </CardContent>
    </Card>
  )
}

function ProfileContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage your personal information and account settings.</p>
        <Button className="mt-4">Edit Profile</Button>
      </CardContent>
    </Card>
  )
}