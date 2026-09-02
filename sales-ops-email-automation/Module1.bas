Option Explicit

' ============================================================================
' SALES OPS EMAIL AUTOMATION
' GenerateEmail reads the Email Generator form, validates required fields,
' merges the matching template from the Templates tab, opens the result as
' an Outlook DRAFT (never sent automatically), and logs the request to the
' Activity Log tab. Buyers and templates are maintained on their own tabs -
' this module does not need to change when either table grows.
' ============================================================================

Sub GenerateEmail()
    Dim wb As Workbook
    Dim buyerName As String, buyerEmail As String, issueType As String
    Dim poNum As String, partNum As String, qty As String, valueStr As String
    Dim reqValue As String, subjTpl As String, bodyTpl As String
    Dim subj As String, body As String
    Dim missing As String

    Set wb = ThisWorkbook

    buyerName = Trim(wb.Names("BuyerCell").RefersToRange.Value & "")
    buyerEmail = Trim(wb.Names("BuyerEmailCell").RefersToRange.Value & "")
    issueType = Trim(wb.Names("IssueTypeCell").RefersToRange.Value & "")
    poNum = Trim(wb.Names("PONumberCell").RefersToRange.Value & "")
    partNum = Trim(wb.Names("PartNumberCell").RefersToRange.Value & "")
    qty = Trim(wb.Names("QtyCell").RefersToRange.Value & "")
    valueStr = Trim(wb.Names("ValueCell").RefersToRange.Value & "")

    reqValue = TemplateField(issueType, "TemplateReqValueList")
    subjTpl = TemplateField(issueType, "TemplateSubjectList")
    bodyTpl = TemplateField(issueType, "TemplateBodyList")

    missing = ""
    If buyerName = "" Then missing = missing & "- Buyer" & vbNewLine
    If buyerName <> "" And buyerEmail = "" Then
        missing = missing & "- Buyer Email is blank for this buyer (check the Buyer Database tab)" & vbNewLine
    ElseIf buyerEmail <> "" And InStr(buyerEmail, "@") = 0 Then
        missing = missing & "- Buyer Email looks invalid (check the Buyer Database tab)" & vbNewLine
    End If
    If issueType = "" Then
        missing = missing & "- Issue Type" & vbNewLine
    ElseIf subjTpl = "" Then
        missing = missing & "- Issue Type not found on the Templates tab" & vbNewLine
    End If
    If poNum = "" Then missing = missing & "- PO Number" & vbNewLine
    If partNum = "" Then missing = missing & "- Part Number" & vbNewLine
    If LCase(reqValue) = "yes" And valueStr = "" Then
        missing = missing & "- " & Trim(wb.Names("ValueLabelCell").RefersToRange.Value & "") & vbNewLine
    End If

    If missing <> "" Then
        MsgBox "Please complete the following before generating the email:" & vbNewLine & vbNewLine & missing, _
               vbExclamation, "Missing Information"
        SetConfirmation "Not generated - missing required fields (" & Format(Now, "hh:mm:ss") & ")."
        Exit Sub
    End If

    subj = ReplacePlaceholders(subjTpl, buyerName, partNum, poNum, qty, valueStr)
    body = ReplacePlaceholders(bodyTpl, buyerName, partNum, poNum, qty, valueStr)

    Dim olApp As Object, olMail As Object
    On Error Resume Next
    Set olApp = GetObject(, "Outlook.Application")
    If olApp Is Nothing Then Set olApp = CreateObject("Outlook.Application")
    On Error GoTo 0

    If olApp Is Nothing Then
        MsgBox "Outlook could not be started. Please make sure Outlook is installed, then try again.", _
               vbCritical, "Outlook Not Available"
        SetConfirmation "Not generated - Outlook unavailable (" & Format(Now, "hh:mm:ss") & ")."
        Exit Sub
    End If

    Set olMail = olApp.CreateItem(0) ' olMailItem
    With olMail
        .To = buyerEmail
        .Subject = subj
        .Body = body
        .Display    ' Opens as a draft for human review - this line intentionally never calls .Send
    End With

    LogActivity buyerName, buyerEmail, issueType, poNum, partNum, qty, valueStr, subj

    SetConfirmation "Draft created for " & buyerName & " (" & issueType & ") at " & _
                     Format(Now, "hh:mm:ss") & ". Logged to Activity Log. Review it in Outlook before sending."

    ClearForm
End Sub

Sub ClearForm()
    With ThisWorkbook
        .Names("ValueCell").RefersToRange.ClearContents
        .Names("PONumberCell").RefersToRange.ClearContents
        .Names("PartNumberCell").RefersToRange.ClearContents
        .Names("QtyCell").RefersToRange.ClearContents
    End With
End Sub

Private Sub SetConfirmation(msg As String)
    ThisWorkbook.Names("ConfirmationCell").RefersToRange.Value = msg
End Sub

Private Function TemplateField(issueType As String, listName As String) As String
    Dim rng As Range
    Dim m As Variant

    TemplateField = ""
    If issueType = "" Then Exit Function

    On Error Resume Next
    Set rng = ThisWorkbook.Names(listName).RefersToRange
    On Error GoTo 0
    If rng Is Nothing Then Exit Function

    m = Application.Match(issueType, ThisWorkbook.Names("IssueTypeList").RefersToRange, 0)
    If Not IsError(m) Then
        TemplateField = CStr(rng.Cells(CLng(m), 1).Value)
    End If
End Function

Private Function ReplacePlaceholders(tpl As String, buyerName As String, partNum As String, _
                                      poNum As String, qty As String, valueStr As String) As String
    Dim s As String
    s = tpl
    s = Replace(s, "{BUYER}", buyerName)
    s = Replace(s, "{PART}", partNum)
    s = Replace(s, "{PO}", poNum)
    s = Replace(s, "{QTY}", qty)
    s = Replace(s, "{VALUE}", valueStr)
    ReplacePlaceholders = s
End Function

Private Sub LogActivity(buyerName As String, buyerEmail As String, issueType As String, poNum As String, _
                         partNum As String, qty As String, valueStr As String, subj As String)
    Dim wsLog As Worksheet
    Dim nextRow As Long
    Dim manualMin As Double, autoMin As Double

    Set wsLog = ThisWorkbook.Worksheets("Activity Log")
    nextRow = wsLog.Cells(wsLog.Rows.Count, 1).End(xlUp).Row + 1

    manualMin = 0: autoMin = 0
    On Error Resume Next
    manualMin = ThisWorkbook.Names("AssumpManualMinutes").RefersToRange.Value
    autoMin = ThisWorkbook.Names("AssumpAutoMinutes").RefersToRange.Value
    On Error GoTo 0

    With wsLog
        .Cells(nextRow, 1).Value = Now
        .Cells(nextRow, 1).NumberFormat = "yyyy-mm-dd hh:mm"
        .Cells(nextRow, 2).Value = Environ("Username")
        .Cells(nextRow, 3).Value = buyerName
        .Cells(nextRow, 4).Value = buyerEmail
        .Cells(nextRow, 5).Value = issueType
        .Cells(nextRow, 6).Value = poNum
        .Cells(nextRow, 7).Value = partNum
        .Cells(nextRow, 8).Value = qty
        .Cells(nextRow, 9).Value = valueStr
        .Cells(nextRow, 10).Value = subj
        .Cells(nextRow, 11).Value = manualMin
        .Cells(nextRow, 12).Value = autoMin
        .Cells(nextRow, 13).Value = manualMin - autoMin
    End With
End Sub
