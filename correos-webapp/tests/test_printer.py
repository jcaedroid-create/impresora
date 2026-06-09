"""
Tests para los comandos de pausar/reanudar impresora.
Mockea las llamadas a CUPS (cupsdisable/cupsenable) para probar
la lógica sin necesidad de impresora ni Meteor.
"""
import subprocess
from unittest.mock import patch, MagicMock

# Nombre de la impresora (debe coincidir con server/main.js)
PRINTER_NAME = "HP_LaserJet_Pro"


def pausar_impresora(printer_name):
    """Simula la lógica del método Meteor pausarImpresora."""
    result = subprocess.run(
        ["cupsdisable", printer_name],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"Error al pausar: {result.stderr or 'comando falló'}")
    return "Impresora pausada correctamente"


def reanudar_impresora(printer_name):
    """Simula la lógica del método Meteor reanudarImpresora."""
    result = subprocess.run(
        ["cupsenable", printer_name],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"Error al reanudar: {result.stderr or 'comando falló'}")
    return "Impresora reanudada correctamente"


# --- Tests ---

class TestPausarImpresora:
    @patch("subprocess.run")
    def test_pausar_exitoso(self, mock_run):
        """Debería pausar la impresora correctamente."""
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")

        resultado = pausar_impresora(PRINTER_NAME)

        assert resultado == "Impresora pausada correctamente"
        mock_run.assert_called_once_with(
            ["cupsdisable", PRINTER_NAME],
            capture_output=True, text=True
        )

    @patch("subprocess.run")
    def test_pausar_usa_nombre_correcto(self, mock_run):
        """Debería usar el nombre de impresora en el comando."""
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")

        pausar_impresora("Mi_Impresora_USB")

        args = mock_run.call_args[0][0]
        assert args == ["cupsdisable", "Mi_Impresora_USB"]

    @patch("subprocess.run")
    def test_pausar_error(self, mock_run):
        """Debería lanzar error si cupsdisable falla."""
        mock_run.return_value = MagicMock(
            returncode=1, stdout="", stderr="cupsdisable: impresora no encontrada"
        )

        try:
            pausar_impresora(PRINTER_NAME)
            assert False, "Debería haber lanzado RuntimeError"
        except RuntimeError as e:
            assert "Error al pausar" in str(e)
            assert "impresora no encontrada" in str(e)


class TestReanudarImpresora:
    @patch("subprocess.run")
    def test_reanudar_exitoso(self, mock_run):
        """Debería reanudar la impresora correctamente."""
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")

        resultado = reanudar_impresora(PRINTER_NAME)

        assert resultado == "Impresora reanudada correctamente"
        mock_run.assert_called_once_with(
            ["cupsenable", PRINTER_NAME],
            capture_output=True, text=True
        )

    @patch("subprocess.run")
    def test_reanudar_usa_nombre_correcto(self, mock_run):
        """Debería usar el nombre de impresora en el comando."""
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")

        reanudar_impresora("Otra_Impresora")

        args = mock_run.call_args[0][0]
        assert args == ["cupsenable", "Otra_Impresora"]

    @patch("subprocess.run")
    def test_reanudar_error(self, mock_run):
        """Debería lanzar error si cupsenable falla."""
        mock_run.return_value = MagicMock(
            returncode=1, stdout="", stderr="cupsenable: impresora no encontrada"
        )

        try:
            reanudar_impresora(PRINTER_NAME)
            assert False, "Debería haber lanzado RuntimeError"
        except RuntimeError as e:
            assert "Error al reanudar" in str(e)
            assert "impresora no encontrada" in str(e)


class TestIntegracion:
    @patch("subprocess.run")
    def test_pausar_y_reanudar(self, mock_run):
        """Debería poder pausar y luego reanudar (flujo completo)."""
        printer_state = {"status": "running"}

        def mock_exec(cmd, **kwargs):
            if cmd[0] == "cupsdisable":
                printer_state["status"] = "paused"
                return MagicMock(returncode=0, stdout="", stderr="")
            elif cmd[0] == "cupsenable":
                printer_state["status"] = "running"
                return MagicMock(returncode=0, stdout="", stderr="")

        mock_run.side_effect = mock_exec

        # Pausar
        pausar_impresora(PRINTER_NAME)
        assert printer_state["status"] == "paused"

        # Reanudar
        reanudar_impresora(PRINTER_NAME)
        assert printer_state["status"] == "running"

    @patch("subprocess.run")
    def test_reanudar_sin_pausar(self, mock_run):
        """Debería poder reanudar aunque no se haya pausado antes."""
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")

        resultado = reanudar_impresora(PRINTER_NAME)
        assert resultado == "Impresora reanudada correctamente"
