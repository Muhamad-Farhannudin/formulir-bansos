'use client'

import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

export default function Page() {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    kk: '',
    fotoKTP: null,
    fotoKK: null,
    umur: '',
    jenisKelamin: '',
    provinsi: '',
    kabupatenKota: '',
    kecamatan: '',
    kelurahan: '',
    alamat: '',
    rt: '',
    rw: '',
    sallarySebelumPandemi: '',
    sallarySetelahPandemi: '',
    alasan: '',
    persetujuan: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [submitData, setSubmitData] = useState([]);

  const [ktpImage, setKtpImage] = useState(null);
  const [kkImage, setKkImage] = useState(null);

  const [disabled, setDisabled] = useState(true);


  const handleInputChange = (event, imageType) => {
    const { name, value, type, files, checked } = event.target;
    const file = type === 'file' && files[0];

    // Jika yang diubah adalah checkbox
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      // Handle setting form data untuk situasi lainnya
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }

    // Update disabled state based on the checkbox value
    setDisabled(!checked);

    //check ukuran file gambar tidak lebih dari 2Mb
    if (file && file.size > 2 * 1024 * 1024) {
      alert('Ukuran file melebihi 2MB. Mohon pilih file dengan ukuran maksimal 2MB.');
      event.target.value = null; // Reset file input

      // set gambar antara ktp dan kk
      if (imageType === 'ktp') {
        setKtpImage(null);
      } else if (imageType === 'kk') {
        setKkImage(null);
      }

      return;
    }

    //check ukuran file gambar tidak lebih dari 2Mb
    if (file && file.size > 2 * 1024 * 1024) {
      alert('Ukuran file melebihi 2MB. Mohon pilih file dengan ukuran maksimal 2MB.');
      event.target.value = null; // Reset file input

      // set gambar antara ktp dan kk
      if (imageType === 'ktp') {
        setKtpImage(null);
      } else if (imageType === 'kk') {
        setKkImage(null);
      }

      return;
    }

    // Handle setting image state
    if (imageType === 'ktp' || imageType === 'kk') {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (imageType === 'ktp') {
            setKtpImage(reader.result);
          } else if (imageType === 'kk') {
            setKkImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    if (name === 'provinsi') {
      setSelectedProvinceId(value);
    }

    if (name === 'kabupatenKota') {
      setSelectedCityId(value);
    }

    if (name === 'kecamatan') {
      setSelectedDistrictId(value);
    }
  };




  const handleSubmit = (e) => {
    e.preventDefault();

    // Menggambarkan keterlambatan respon
    const delay = 1500; // Waktu tunda dalam milidetik (1,5 detik)
    const successProbability = 0.9; // Peluang keberhasilan (90%)

    setTimeout(() => {
      // Simulasi keberhasilan atau kegagalan
      const isSuccessful = Math.random() <= successProbability;

      if (isSuccessful) {
        setSubmitData([...submitData, formData]);
      } else {
        alert('Pengiriman gagal. Silakan coba lagi.');
      }

      setFormData({
        nama: '',
        nik: '',
        kk: '',
        fotoKTP: null,
        fotoKK: null,
        umur: '',
        jenisKelamin: '',
        provinsi: '',
        kabupatenKota: '',
        kecamatan: '',
        kelurahan: '',
        alamat: '',
        rt: '',
        rw: '',
        sallarySebelumPandemi: '',
        sallarySetelahPandemi: '',
        alasan: '',
        persetujuan: false,
      });
    }, delay);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const provinsiResponse = await axios.get('http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        setProvinces(provinsiResponse.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvinceId) {
        try {
          const kotaResponse = await axios.get(`http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`);
          setCities(kotaResponse.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };

    fetchCities();
  }, [selectedProvinceId]);

  useEffect(() => {
    const fetchDistrict = async () => {
      if (selectedCityId) {
        try {
          const kecamatanRespon = await axios.get(`http://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCityId}.json`);
          setDistricts(kecamatanRespon.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    }

    fetchDistrict();
  }, [selectedCityId]);

  useEffect(() => {
    const fetchVillages = async () => {
      if (selectedDistrictId) {
        try {
          const kelurahanRespon = await axios.get(`http://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrictId}.json`);
          setVillages(kelurahanRespon.data);
        } catch (error) {
          console.error('Error fetching villages:', error);
        }
      }
    }

    fetchVillages();
  }, [selectedDistrictId]);

  return (
    <div className='bg-white items-center p-3 max-w-full mb-52'>
      <div className='mx-auto w-1/2 bg-slate-200 p-5 rounded-lg shadow-2xl shadow-black'>
        <h1 className='text-3xl font-bold text-center text-slate-800 mb-5'>Formulir Bansos</h1>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor='nama' className='block mb-2 text-sm font-medium text-gray-900'>
                    Nama
                  </label>
                </td>
                <td>
                  <Input
                    type={'text'}
                    name={'nama'}
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="nik" className='block mb-2 text-sm font-medium text-gray-900'>NIK</label></td>
                <td><Input type="number" name={"nik"} value={formData.nik || ''} onChange={handleInputChange} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="kk" className='block mb-2 text-sm font-medium text-gray-900'>Nomor Kartu Keluarga</label></td>
                <td><Input type="number" name={"kk"} value={formData.kk || ''} onChange={handleInputChange} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="fotoKtp" className='block mb-2 text-sm font-medium text-gray-900'>Foto KTP</label></td>
                <td><Input type={"file"} accept="image/*" name={"fotoKtp"} onChange={(e) => handleInputChange(e, 'ktp')} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="fotoKk" className='block mb-2 text-sm font-medium text-gray-900'>Foto Kartu Keluarga</label></td>
                <td><Input type={"file"} accept="image/*" name={"fotoKk"} onChange={(e) => handleInputChange(e, 'kk')} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="umur" className='block mb-2 text-sm font-medium text-gray-900'>Umur</label></td>
                <td><Input type="number" name={"umur"} value={formData.umur} onChange={handleInputChange} required min={25} /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="jenisKelamin" className='block mb-2 text-sm font-medium text-gray-900'>Jenis Kelamin</label></td>
                <td>
                  <select id="jenisKelamin" name="jenisKelamin" className='border border-slate-300 rounded-md py-1 pr-2' value={formData.jenisKelamin} onChange={handleInputChange} required>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor='provinsi'>Provinsi:</label>
                </td>
                <td>
                  <select id='Provinsi' name='provinsi' className='border border-slate-300 rounded-md py-1 pr-2' value={formData.provinsi} onChange={handleInputChange} required>
                    <option value=''>Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option value={prov.id} key={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor='kabkota'>Kab/Kota:</label>
                </td>
                <td>
                  <select
                    id='kabkota'
                    name='kabupatenKota'
                    className='border border-slate-300 rounded-md py-1 pr-2'
                    value={formData.kabupatenKota}
                    onChange={handleInputChange}
                    required
                  >
                    <option value=''>Pilih Kab/Kota</option>
                    {cities.map((city) => (
                      <option value={city.id} key={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor='kecamatan'>Kecamatan:</label>
                </td>
                <td>
                  <select
                    id='kecamatan'
                    name='kecamatan'
                    className='border border-slate-300 rounded-md py-1 pr-2'
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value=''>Pilih Kecamatan</option>
                    {districts.map((dist) => (
                      <option value={dist.id} key={dist.id}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor='kelurahan'>Kelurahan:</label>
                </td>
                <td>
                  <select
                    id='kelurahan'
                    name='kelurahan'
                    className='border border-slate-300 rounded-md py-1 pr-2'
                    value={formData.kelurahan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value=''>Pilih kelurahan</option>
                    {villages.map((village) => (
                      <option value={village.id} key={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="alamat">Alamat:</label></td>
                <td><textarea id="alamat" name="alamat" className='border border-slate-300 rounded-md py-1 pr-2' value={formData.alamat} onChange={handleInputChange} required maxLength="255" /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="rt" className='block mb-2 text-sm font-medium text-gray-900'>RT</label></td>
                <td><Input type="number" name={"rt"} value={formData.rt || ''} onChange={handleInputChange} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="rw" className='block mb-2 text-sm font-medium text-gray-900'>RW</label></td>
                <td><Input type="number" name={"rw"} value={formData.rw || ''} onChange={handleInputChange} required /></td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="sallarySebelumPandemi" className="block mb-2 text-sm font-medium text-gray-900">
                    Penghasilan sebelum pandemi
                  </label>
                </td>
                <td>
                  <Input
                    type="number"
                    name="sallarySebelumPandemi"
                    value={formData.sallarySebelumPandemi || ''}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="sallarySetelahPandemi" className="block mb-2 text-sm font-medium text-gray-900">
                    Penghasilan setelah pandemi
                  </label>
                </td>
                <td>
                  <Input
                    type="number"
                    name="sallarySetelahPandemi"
                    value={formData.sallarySetelahPandemi || ''}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="alasan" className="block mb-2 mr-10 text-sm font-medium text-gray-900">
                    Alasan membutuhkan bantuan
                  </label>
                </td>
                <td>
                  <select
                    id="alasan"
                    name="alasan"
                    className='border border-slate-300 rounded-md py-1 pr-2'
                    value={formData.alasan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih alasan</option>
                    <option value="kehilangan_pekerjaan">Kehilangan pekerjaan</option>
                    <option value="terdampak_covid19">Kepala keluarga terdampak atau korban Covid-19</option>
                    <option value="fakir_miskin_sejak_sebelum_covid19">Tergolong fakir/miskin semenjak sebelum Covid-19</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </td>
              </tr>
              {formData.alasan === "lainnya" && (
                <tr>
                  <td>
                    <label htmlFor="lainnya" className="block mb-2 text-sm font-medium text-gray-900">
                      Lainnya:
                    </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="lainnya"
                      name="lainnya"
                      className='border border-slate-300 rounded-md py-1 pr-2'
                      value={formData.lainnya}
                      onChange={handleInputChange}
                      placeholder=" isi alasan lainnya"
                      required
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='w-3/4 mt-3'>
            <label htmlFor="persetujuan" className="text-sm text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                name="persetujuan"
                className='mr-2 cursor-pointer'
                checked={formData.persetujuan}
                onChange={handleInputChange}
              />
              Saya menyatakan bahwa data yang diisikan adalah benar dan siap mempertanggungjawabkan apabila ditemukan ketidaksesuaian dalam data tersebut.
            </label>
            <Button
              type="submit"
              className={`bg-black text-white px-3 py-2 mt-3`}
              children="Tambah"
              disabled={disabled}
            />
          </div>
        </form>
      </div>
      <div className='mx-auto w-[70%] overflow-x-auto mt-10'>
        <h2 className='text-xl text-slate-800 font-semibold my-3'>Data yang Telah Disubmit:</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-blue-950 text-slate-200 dark:bg-gray-800">
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">NIK</th>
              <th className="p-2 border">KK</th>
              <th className="p-2 border">Foto KTP</th>
              <th className="p-2 border">Foto KK</th>
              <th className="p-2 border">Umur</th>
              <th className="p-2 border">Jenis Kelamin</th>
              <th className="p-2 border">Provinsi</th>
              <th className="p-2 border">Kabupaten / Kota</th>
              <th className="p-2 border">Kecamatan</th>
              <th className="p-2 border">Kelurahan</th>
              <th className="p-2 border">Alamat</th>
              <th className="p-2 border">RT</th>
              <th className="p-2 border">RW</th>
              <th className="p-2 border">Penghasilan Sebelum Pandemi</th>
              <th className="p-2 border">Penghasilan Setelah Pandemi</th>
              <th className="p-2 border">Alasan</th>
            </tr>
          </thead>
          <tbody>
            {submitData.map((data, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="p-2 text-center border">{data.nama}</td>
                <td className="p-2 text-center border">{data.nik}</td>
                <td className="p-2 text-center border">{data.kk}</td>
                <td className="p-2 text-center border">
                  <div className="w-36">
                    {ktpImage && <img src={ktpImage} alt="Foto KTP" />}
                  </div>
                </td>
                <td className="p-2 text-center border">
                  <div className="w-36">
                    {kkImage && <img src={kkImage} alt="Foto KK" />}
                  </div>
                </td>
                <td className="p-2 text-center border">{data.umur}</td>
                <td className="p-2 text-center border">{data.jenisKelamin}</td>
                <td className="p-2 text-center border">
                  {provinces.find((prov) => prov.id === data.provinsi)?.name || 'N/A'}
                </td>
                <td className="p-2 text-center border">
                  {cities.find((city) => city.id === data.kabupatenKota)?.name || 'N/A'}
                </td>
                <td className="p-2 text-center border">
                  {districts.find((dist) => dist.id === data.kecamatan)?.name || 'N/A'}
                </td>
                <td className="p-2 text-center border">
                  {villages.find((village) => village.id === data.kelurahan)?.name || 'N/A'}
                </td>
                <td className="p-2 text-center border">{data.alamat}</td>
                <td className="p-2 text-center border">0{data.rt}</td>
                <td className="p-2 text-center border">0{data.rw}</td>
                <td className="p-2 text-center border">Rp. {data.sallarySebelumPandemi}</td>
                <td className="p-2 text-center border">Rp. {data.sallarySetelahPandemi}</td>
                <td className="p-2 text-center border">{data.alasan}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
