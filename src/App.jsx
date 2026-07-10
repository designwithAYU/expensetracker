return (
  <BrowserRouter basename="/expensetracker">
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/insights" element={<AIInsights />} />
        <Route path="/budget" element={<BudgetPlanner />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
