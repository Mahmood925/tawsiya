Add-Type -AssemblyName System.Drawing

function New-AppIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [bool]$Rounded = $true
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $navy = [System.Drawing.Color]::FromArgb(255, 11, 31, 58)
    $navyBrush = New-Object System.Drawing.SolidBrush $navy

    if ($Rounded) {
        $radius = $Size * 0.24
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc(0, 0, $d, $d, 180, 90)
        $path.AddArc($Size - $d, 0, $d, $d, 270, 90)
        $path.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
        $path.AddArc(0, $Size - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($navyBrush, $path)
    } else {
        $g.FillRectangle($navyBrush, 0, 0, $Size, $Size)
    }

    # icon viewBox is 58x58, source coords below
    $scale = ($Size / 58.0) * 0.66
    $cx = $Size / 2.0
    $cy = $Size / 2.0
    # center of source icon (approx bounding box center of the path points)
    $srcCx = 27.0
    $srcCy = 29.0

    function Pt($x, $y) {
        return New-Object System.Drawing.PointF(($cx + ($x - $srcCx) * $scale), ($cy + ($y - $srcCy) * $scale))
    }

    $gold = [System.Drawing.Color]::FromArgb(255, 212, 167, 44)
    $emerald = [System.Drawing.Color]::FromArgb(255, 23, 165, 103)

    $pen = New-Object System.Drawing.Pen $gold, ([Math]::Max(2.0, 4.5 * $scale))
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $linePts = @((Pt 8 42), (Pt 20 34), (Pt 30 40), (Pt 46 16))
    $g.DrawLines($pen, $linePts)
    $arrowPts = @((Pt 38 16), (Pt 46 16), (Pt 46 24))
    $g.DrawLines($pen, $arrowPts)

    $dotBrush = New-Object System.Drawing.SolidBrush $emerald
    $r = 3.4 * $scale
    foreach ($p in @((Pt 20 34), (Pt 8 42))) {
        $g.FillEllipse($dotBrush, $p.X - $r, $p.Y - $r, $r * 2, $r * 2)
    }
    $midBrush = New-Object System.Drawing.SolidBrush $navy
    $midPt = Pt 30 40
    $g.FillEllipse($midBrush, $midPt.X - $r, $midPt.Y - $r, $r * 2, $r * 2)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

$outDir = "C:\Users\User\New folder\public\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

New-AppIcon -Size 192 -OutPath "$outDir\icon-192.png" -Rounded $true
New-AppIcon -Size 512 -OutPath "$outDir\icon-512.png" -Rounded $true
New-AppIcon -Size 512 -OutPath "$outDir\icon-maskable-512.png" -Rounded $false
New-AppIcon -Size 180 -OutPath "$outDir\apple-touch-icon.png" -Rounded $false
New-AppIcon -Size 1024 -OutPath "$outDir\icon-1024.png" -Rounded $false

Write-Output "Icons generated."
