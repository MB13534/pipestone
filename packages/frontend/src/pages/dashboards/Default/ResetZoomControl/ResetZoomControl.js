// Control implemented as ES6 class
import { STARTING_LOCATION } from "../../../../constants";

class ResetZoomControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this._container.style.padding = `3px`;

    const icon = document.createElement("i");
    icon.className = "material-icons";
    icon.style.verticalAlign = "middle";
    icon.style.cursor = "pointer";
    icon.textContent = "explore";
    this._container.appendChild(icon);
    this._container.addEventListener("click", (e) => {
      map.flyTo({
        center: STARTING_LOCATION,
        zoom: 11,
      });
    });
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default ResetZoomControl;
