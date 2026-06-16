# PowerShell script to rename photos from devils-gate to parque-natural-cerro-verde
$dir = "C:\Users\Administrator\Documents\GitHub\萨尔瓦多\parque-natural-cerro-verde\public\gallery"

Set-Location $dir

Get-ChildItem "devils-gate (*).jpg" | ForEach-Object {
    if ($_.Name -match 'devils-gate \(([0-9]+)\)\.jpg') {
        $num = $matches[1]
        $newName = "parque-natural-cerro-verde ($num).jpg"
        Write-Host "Renaming: $($_.Name) -> $newName"
        Rename-Item $_.Name -NewName $newName
    }
}

Write-Host "Done!"
