Add-Type -AssemblyName System.Drawing

function New-ShieldIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [bool]$FullBleed = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $gold = [System.Drawing.Color]::FromArgb(255, 184, 134, 63)
    $goldBrush = New-Object System.Drawing.SolidBrush $gold

    if ($FullBleed) {
        $g.FillRectangle($goldBrush, 0, 0, $Size, $Size)
        $scale = $Size / 32.0
        $offsetX = 0
        $offsetY = 0
        $shieldScale = 0.62
        $cx = $Size / 2.0
        $cy = $Size / 2.0
    } else {
        $radius = $Size * 0.22
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc(0, 0, $d, $d, 180, 90)
        $path.AddArc($Size - $d, 0, $d, $d, 270, 90)
        $path.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
        $path.AddArc(0, $Size - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($goldBrush, $path)
        $scale = $Size / 32.0
        $shieldScale = 1.0
        $cx = $Size / 2.0
        $cy = $Size / 2.0
    }

    $s = $scale * $shieldScale

    function Pt($x, $y) {
        return New-Object System.Drawing.PointF(($cx + ($x - 16) * $s), ($cy + ($y - 16) * $s))
    }

    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([Math]::Max(1.4, 1.8 * $s))
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $shieldPts = @(
        (Pt 16 5), (Pt 25 8.5), (Pt 25 16),
        (Pt 25 22), (Pt 20.8 26.2), (Pt 16 27.5),
        (Pt 11.2 26.2), (Pt 7 22), (Pt 7 16), (Pt 7 8.5), (Pt 16 5)
    )
    $g.DrawLines($pen, $shieldPts)

    $checkPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([Math]::Max(1.6, 2.1 * $s))
    $checkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $checkPts = @((Pt 11.5 16.2), (Pt 14.5 19.2), (Pt 20.8 12.5))
    $g.DrawLines($checkPen, $checkPts)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

$outDir = "C:\Users\User\New folder\public\icons"

New-ShieldIcon -Size 192 -OutPath "$outDir\icon-192.png" -FullBleed $false
New-ShieldIcon -Size 512 -OutPath "$outDir\icon-512.png" -FullBleed $false
New-ShieldIcon -Size 512 -OutPath "$outDir\icon-maskable-512.png" -FullBleed $true
New-ShieldIcon -Size 180 -OutPath "$outDir\apple-touch-icon.png" -FullBleed $true

Write-Output "Icons generated."
