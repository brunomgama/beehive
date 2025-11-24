'use client'

import type React from "react"
import { HelpCircle, Delete, CornerUpLeft } from "lucide-react"
import { BankAccount, MovementStatus, MovementType } from "@/lib/api/bank-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface NewMovementMobileProps {
  accounts: BankAccount[]
  loading: boolean
  error: string | null
  formData: {
    accountId: number
    type: MovementType
    category: string
    amount: number
    status: MovementStatus
    description: string
    date: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onBack?: () => void
}

export function NewMovement({accounts, loading, error, formData, onChange, onSubmit, onBack}: NewMovementMobileProps) {
  const [payAmount, setPayAmount] = useState("");

  const selectedAccount = accounts.find((a) => a.id === formData.accountId)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 mb-6">
        <Button variant={"outline"} onClick={onBack} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
          <CornerUpLeft className="!h-5 !w-5 text-color"/>
        </Button>

        <h1 className="font-semibold text-color">
          New movement
        </h1>

        <Button variant={"default"} onClick={onBack} className="w-12 h-12 rounded-2xl bg-background-darker-blue shadow-sm flex items-center justify-center">
          <HelpCircle className="!h-6 !w-6 card-text-color" />
        </Button>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col flex-1 px-4 pb-10 space-y-4">
        <input type="hidden" name="status" value="CONFIRMED" />
        {/* Amount card */}
        <div className="rounded-3xl bg-card shadow-sm px-4 py-3 min-h-[5rem] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-normal-blue">
            <span>Amount</span>
            <span> {selectedAccount ? `From ${selectedAccount.accountName}` : "Select account"}</span>
          </div>

          <div className="mt-2 relative">
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-sf-display ${payAmount === "" ? "text-[#737373]" : "text-color"}`}>€</span>
            <Input id="amount" name="amount" type="number" inputMode="decimal" placeholder="0.00" value={formData.amount === 0 ? "" : formData.amount} 
              onChange={onChange} className="text-2xl text-color font-sf-display font-bold bg-transparent border-none focus-visible:ring-0 pl-6 pr-0 shadow-none"/>



            {/* Account selector (simple pill, hooked to formData.accountId) */}
            {/* <select id="accountId" name="accountId" value={formData.accountId} onChange={onChange}
              className="text-xs rounded-full bg-[#F3F3F3] px-3 py-1 border border-transparent focus:border-gray-300">
              <option value={0}>Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountName}
                </option>
              ))}
            </select> */}
          </div>
        </div>

        <div className="rounded-2xl bg-card shadow-sm px-4 py-3 flex text-xs min-h-[5rem] w-full">
          <div className="flex flex-col space-y-1 flex-1">
            <span className="text-normal-blue mb-3">Category</span>
            
            <select id="category" name="category" value={formData.category} onChange={onChange}
              className="bg-transparent text-text-color text-lg focus:outline-none w-full pr-2">
              <option value="SHOPPING">Shopping</option>
              <option value="NET">Internet</option>
              <option value="TECH">Tech</option>
              <option value="FOOD_DRINKS">Food & Drinks</option>
              <option value="TRANSPORT">Transport</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="HEALTH">Health</option>
              <option value="UTILITIES">Utilities</option>
              <option value="EDUCATION">Education</option>
              <option value="STREAMING_SERVICES">Streaming</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* <div className="flex flex-col space-y-1">
            <span className="text-[#8A8A8A]">Date</span>
            <input id="date" name="date" type="date" value={formData.date} onChange={onChange} className="bg-transparent text-text-color text-xs focus:outline-none"/>
          </div> */}

          {/* <div className="flex flex-col space-y-1 items-end">
            <span className="text-[#8A8A8A]">Status</span>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onChange}
              className="bg-transparent text-text-color text-xs focus:outline-none"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>
          </div> */}
        </div>

        {/* Description (simple input row) */}
        <div className="rounded-2xl bg-card shadow-sm px-4 py-3 min-h-[5rem] flex flex-col justify-between">
          <label className="block text-xs text-normal-blue mb-1">
            Description
          </label>
          <input id="description" name="description" value={formData.description} onChange={onChange} placeholder="What is this movement?" 
            className="w-full bg-transparent text-sm text-text-color focus:outline-none" maxLength={255}/>
          <p className="mt-1 text-[0.5rem] text-normal-blue">
            {formData.description.length}/255 characters
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Big gradient button */}
        <div className="sticky bottom-0 left-0 right-0 mt-auto bg-background pb-4 pt-2">
          <Button type="submit" disabled={loading} 
            className="w-full h-14 rounded-full py-3 text-sm font-semibold card-text-color bg-gradient-to-r from-[#112D4E] to-[#3F72AF] 
              shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
