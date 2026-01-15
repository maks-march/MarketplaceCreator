terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
      version = "0.90.0"
    }
  }
}

locals {
  folder_id = "b1g2335dd1hetd28qabl"
  cloud_id = "b1gejijn2qq1uv0ea6vf"
}

provider "yandex" {
  cloud_id = local.cloud_id
  folder_id = local.folder_id
  service_account_key_file = "D:/progs/virtualmachines/authorized_key.json"
  zone = var.zone
}