Add-Type -AssemblyName System.Drawing

$Size = 1024
$bmp = New-Object System.Drawing.Bitmap $Size, $Size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$gold = [System.Drawing.Color]::FromArgb(255, 184, 134, 63)
$goldBrush = New-Object System.Drawing.SolidBrush $gold
$g.FillRectangle($goldBrush, 0, 0, $Size, $Size)

$scale = $Size / 32.0
$shieldScale = 0.62
$cx = $Size / 2.0
$cy = $Size / 2.0
$s = $scale * $shieldScale

function Pt($x, $y) {
    return New-Object System.Drawing.PointF(($cx + ($x - 16) * $s), ($cy + ($y - 16) * $s))
}

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (1.8 * $s)
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$shieldPts = @(
    (Pt 16 5), (Pt 25 8.5), (Pt 25 16),
    (Pt 25 22), (Pt 20.8 26.2), (Pt 16 27.5),
    (Pt 11.2 26.2), (Pt 7 22), (Pt 7 16), (Pt 7 8.5), (Pt 16 5)
)
$g.DrawLines($pen, $shieldPts)

$checkPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (2.1 * $s)
$checkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPts = @((Pt 11.5 16.2), (Pt 14.5 19.2), (Pt 20.8 12.5))
$g.DrawLines($checkPen, $checkPts)

$outDir = "C:\Users\User\New folder\assets"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$bmp.Save("$outDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# splash: same gold bg, logo centered smaller, for splash screen
$splashBmp = New-Object System.Drawing.Bitmap 2732, 2732
$gs = [System.Drawing.Graphics]::FromImage($splashBmp)
$gs.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gs.FillRectangle($goldBrush, 0, 0, 2732, 2732)
$sScale = 2732 / 32.0 * 0.32
$scx = 2732 / 2.0
$scy = 2732 / 2.0
function PtS($x, $y) {
    return New-Object System.Drawing.PointF(($scx + ($x - 16) * $sScale), ($scy + ($y - 16) * $sScale))
}
$penS = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (1.8 * $sScale)
$penS.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$penS.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$penS.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$shieldPtsS = @(
    (PtS 16 5), (PtS 25 8.5), (PtS 25 16),
    (PtS 25 22), (PtS 20.8 26.2), (PtS 16 27.5),
    (PtS 11.2 26.2), (PtS 7 22), (PtS 7 16), (PtS 7 8.5), (PtS 16 5)
)
$gs.DrawLines($penS, $shieldPtsS)
$checkPenS = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (2.1 * $sScale)
$checkPenS.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$checkPenS.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPenS.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPtsS = @((PtS 11.5 16.2), (PtS 14.5 19.2), (PtS 20.8 12.5))
$gs.DrawLines($checkPenS, $checkPtsS)
$splashBmp.Save("$outDir\splash.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Output "Generated icon.png and splash.png"
