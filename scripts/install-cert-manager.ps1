param(
    [string]$Version = "v1.14.1"
)

Write-Host "Installing cert-manager $Version (CRDs first)..."

function Apply-RemoteManifest($Url) {
    Write-Host "Applying $Url"
    kubectl apply -f $Url
}

$crdsUrl = "https://github.com/cert-manager/cert-manager/releases/download/$Version/cert-manager.crds.yaml"
$fullUrl = "https://github.com/cert-manager/cert-manager/releases/download/$Version/cert-manager.yaml"

Apply-RemoteManifest $crdsUrl
Apply-RemoteManifest $fullUrl
