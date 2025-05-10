"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ErrorLog {
  message: string
  source: string
  timestamp: string
  stack?: string
  componentName?: string
  additionalInfo?: Record<string, any>
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

export default function ErrorLogsViewer() {
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchLogs() {
      try {
        // In a real app, you'd have an API endpoint to fetch logs
        // For demo purposes, we'll simulate some logs
        const mockLogs: ErrorLog[] = [
          {
            message: "Failed to load logo asset",
            source: "client",
            timestamp: new Date().toISOString(),
            componentName: "LogoVariant",
            url: "/logo-demo",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          {
            message: "Animation error in logo rendering",
            source: "client",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            componentName: "AnimatedLogo",
            stack: "Error: Animation error\n    at AnimatedLogo.tsx:45:12",
            url: "/admin/logo-showcase",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          },
          {
            message: "Server error processing logo export",
            source: "server",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            additionalInfo: { format: "svg", size: "large" },
          },
        ]

        setLogs(mockLogs)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch error logs")
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredLogs = activeTab === "all" ? logs : logs.filter((log) => log.source === activeTab)

  const getSeverityColor = (message: string) => {
    if (message.includes("failed") || message.includes("error")) return "bg-red-100 text-red-800"
    if (message.includes("warning")) return "bg-yellow-100 text-yellow-800"
    return "bg-blue-100 text-blue-800"
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) return <div className="p-8 text-center">Loading error logs...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Error Logs Viewer</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="client">Client Errors</TabsTrigger>
          <TabsTrigger value="server">Server Errors</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <Badge variant="outline" className="mr-2">
            {filteredLogs.length} logs
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {logs.filter((log) => log.source === "client").length} client errors
          </Badge>
          <Badge variant="outline" className="ml-2 bg-blue-50">
            {logs.filter((log) => log.source === "server").length} server errors
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert("This would refresh the logs in a real app")}>
          Refresh
        </Button>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">No error logs found</div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className={`px-2 py-1 rounded text-sm ${getSeverityColor(log.message)}`}>
                  {log.source === "client" ? "Client Error" : "Server Error"}
                </div>
                <div className="text-sm text-gray-500">{formatDate(log.timestamp)}</div>
              </div>

              <h3 className="font-semibold text-lg mb-2">{log.message}</h3>

              {log.componentName && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Component:</span> {log.componentName}
                </div>
              )}

              {log.url && (
                <div className="mb-2">
                  <span className="text-sm font-medium">URL:</span> {log.url}
                </div>
              )}

              {log.stack && (
                <div className="mt-2">
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600">View Stack Trace</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">{log.stack}</pre>
                  </details>
                </div>
              )}

              {log.additionalInfo && (
                <div className="mt-2">
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600">Additional Info</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.additionalInfo, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
