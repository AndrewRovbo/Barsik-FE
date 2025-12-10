import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import "../styles/profile.scss";
import { useTranslation } from 'react-i18next';

export default function Profile() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [profile, setProfile] = useState(null);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [errorProfile, setErrorProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [saving, setSaving] = useState(false);

	const [editForm, setEditForm] = useState({
		email: "",
		firstName: "",
		lastName: "",
		phoneNumber: "",
		avatarUrl: "",
		address: ""
	});

	const [ownerForm, setOwnerForm] = useState({
		aboutMe: "",
		ownerVerified: false
	});

	const [sitterForm, setSitterForm] = useState({
		experienceSummary: "",
		averageRating: "",
		reviewsCount: "",
		sitterVerified: false
	});

	const [pets, setPets] = useState([]);
	const [loadingPets, setLoadingPets] = useState(false);
	const [showPetForm, setShowPetForm] = useState(false);
	const [editingPet, setEditingPet] = useState(null);
	const [petForm, setPetForm] = useState({
		name: "",
		species: "",
		breed: "",
		age: "",
		description: ""
	});

	const [availability, setAvailability] = useState([]);
	const [loadingAvailability, setLoadingAvailability] = useState(false);

	useEffect(() => {
		fetchProfile();
	}, []);

	useEffect(() => {
		if (profile && isEditing) {
			setEditForm({
				email: profile.email || "",
				firstName: profile.firstName || "",
				lastName: profile.lastName || "",
				phoneNumber: profile.phone || profile.phoneNumber || "",
				avatarUrl: profile.avatarUrl || "",
				address: profile.address || ""
			});

			const role = (profile.role || "").toUpperCase();
			if (role === "OWNER") {
				const ownerData = profile.owner || profile.ownerProfile || {};
				setOwnerForm({
					aboutMe: ownerData.aboutMe || "",
					ownerVerified: ownerData.ownerVerified || false
				});
				fetchPets();
			}

			if (role === "SITTER") {
				const sitterData = profile.sitter || profile.sitterProfile || {};
				setSitterForm({
					experienceSummary: sitterData.experienceSummary || "",
					averageRating: sitterData.averageRating ? String(sitterData.averageRating) : "",
					reviewsCount: sitterData.reviewsCount ? String(sitterData.reviewsCount) : "",
					sitterVerified: sitterData.sitterVerified || false
				});
				fetchAvailability();
			}
		}
	}, [profile, isEditing]);

	async function fetchProfile() {
		setLoadingProfile(true);
		setErrorProfile(null);
		setProfile(null);

		const endpoints = [
			"/api/profile",
			"/api/auth/me",
			"/api/users/me",
			"/api/user/me"
		];

		for (const url of endpoints) {
			try {
				const res = await api.get(url);
				console.log("Profile data received:", res.data);
				console.log("Role in profile:", res.data?.role, res.data?.userRole);
				setProfile(res.data);
				setLoadingProfile(false);
				return;
			} catch (e) {
			}
		}

		setErrorProfile(t('profile.errors.load_failed','Failed to load profile. Please try again later.'));
		setLoadingProfile(false);
	}

	async function fetchPets() {
		const role = (profile?.role || "").toUpperCase();
		if (role !== "OWNER") return;
		setLoadingPets(true);
		try {
			const res = await api.get("/api/profile/owner/pets");
			setPets(Array.isArray(res.data) ? res.data : []);
		} catch (error) {
			console.error("Failed to fetch pets:", error);
		} finally {
			setLoadingPets(false);
		}
	}

	async function fetchAvailability() {
		const role = (profile?.role || "").toUpperCase();
		if (role !== "SITTER") return;
		setLoadingAvailability(true);
		try {
			const res = await api.get("/api/profile/sitter/avaliability");
			setAvailability(Array.isArray(res.data) ? res.data : []);
		} catch (error) {
			console.error("Failed to fetch availability:", error);
		} finally {
			setLoadingAvailability(false);
		}
	}

	async function handleSaveUser() {
		setSaving(true);
		try {
			await api.put("/api/profile/user", editForm);
			await fetchProfile();
			setIsEditing(false);
			alert(t('profile.alerts.updated','Profile updated successfully!'));
		} catch (error) {
			console.error("Failed to update profile:", error);
			alert(t('profile.alerts.update_failed','Failed to update profile. Please try again.'));
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveOwner() {
		setSaving(true);
		try {
			await api.put("/api/profile/owner", ownerForm);
			await fetchProfile();
			alert(t('profile.alerts.owner_updated','Owner profile updated successfully!'));
		} catch (error) {
			console.error("Failed to update owner profile:", error);
			alert(t('profile.alerts.owner_update_failed','Failed to update owner profile. Please try again.'));
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveSitter() {
		setSaving(true);
		try {
			const payload = {
				...sitterForm,
				averageRating: sitterForm.averageRating ? parseFloat(sitterForm.averageRating) : null,
				reviewsCount: sitterForm.reviewsCount ? parseInt(sitterForm.reviewsCount) : null
			};
			await api.put("/api/profile/sitter", payload);
			await fetchProfile();
			alert(t('profile.alerts.sitter_updated','Sitter profile updated successfully!'));
		} catch (error) {
			console.error("Failed to update sitter profile:", error);
			alert(t('profile.alerts.sitter_update_failed','Failed to update sitter profile. Please try again.'));
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveAvailability() {
		setSaving(true);
		try {
			await api.put("/api/profile/sitter/avaliability", availability);
			alert("Availability updated successfully!");
		} catch (error) {
			console.error("Failed to update availability:", error);
			alert(t('profile.alerts.availability_update_failed','Failed to update availability. Please try again.'));
		} finally {
			setSaving(false);
		}
	}

	async function handleAddPet() {
		try {
			await api.post("/api/profile/owner/pets", petForm);
			await fetchPets();
			setShowPetForm(false);
			setPetForm({ name: "", species: "", breed: "", age: "", description: "" });
			alert(t('profile.alerts.pet_added','Pet added successfully!'));
		} catch (error) {
			console.error("Failed to add pet:", error);
			alert(error.response?.data?.message || t('profile.alerts.add_pet_failed','Failed to add pet. Please try again.'));
		}
	}

	async function handleUpdatePet(slug) {
		try {
			await api.put(`/api/profile/owner/pets/${slug}`, petForm);
			await fetchPets();
			setEditingPet(null);
			setShowPetForm(false);
			setPetForm({ name: "", species: "", breed: "", age: "", description: "" });
			alert(t('profile.alerts.pet_updated','Pet updated successfully!'));
		} catch (error) {
			console.error("Failed to update pet:", error);
			alert(t('profile.alerts.update_pet_failed','Failed to update pet. Please try again.'));
		}
	}

	async function handleDeletePet(slug) {
		if (!window.confirm(t('profile.confirm.delete_pet','Are you sure you want to delete this pet?'))) {
			return;
		}
		try {
			await api.delete(`/api/profile/owner/pets/${slug}`);
			await fetchPets();
			alert(t('profile.alerts.pet_deleted','Pet deleted successfully!'));
		} catch (error) {
			console.error("Failed to delete pet:", error);
			alert(t('profile.alerts.delete_pet_failed','Failed to delete pet. Please try again.'));
		}
	}

	function startEditPet(pet) {
		setEditingPet(pet);
		setPetForm({
			name: pet.name || "",
			species: pet.species || "",
			breed: pet.breed || "",
			age: pet.age || "",
			description: pet.description || ""
		});
		setShowPetForm(true);
	}

	function cancelEditPet() {
		setEditingPet(null);
		setShowPetForm(false);
		setPetForm({ name: "", species: "", breed: "", age: "", description: "" });
	}

	async function handleDeleteAccount() {
		if (!window.confirm(t('profile.confirm.delete_account','Are you sure you want to delete your account? This action cannot be undone.'))) {
			return;
		}

		try {
			await api.delete("/api/profile/user");
			localStorage.removeItem("user");
			document.cookie = "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			navigate("/log-in");
		} catch (error) {
			console.error("Failed to delete account:", error);
			alert(t('profile.alerts.delete_failed','Failed to delete account. Please try again.'));
		}
	}

	function handleLogout() {
		localStorage.removeItem("user");
		document.cookie = "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		navigate("/log-in");
	}

	function getInitials(name, email) {
		if (name) {
			const parts = name.trim().split(" ");
			if (parts.length >= 2) {
				return (parts[0][0] + parts[1][0]).toUpperCase();
			}
			return name[0].toUpperCase();
		}
		if (email) {
			return email[0].toUpperCase();
		}
		return "U";
	}

	function formatRole(role) {
		if (!role) return "—";
		const roleMap = {
			OWNER: "Owner",
			SITTER: "Sitter",
			ADMIN: "Administrator"
		};
		return roleMap[role] || role;
	}

	function getRoleClass(role) {
		if (!role) return "";
		const roleLower = role.toLowerCase();
		if (roleLower === "owner") return "owner";
		if (roleLower === "sitter") return "sitter";
		if (roleLower === "admin") return "admin";
		return "";
	}

	function renderEditForm() {
		return (
			<>
				<div className="profile-content">
					<div className="profile-section">
						<h2>Edit Basic Information</h2>
						<div className="info-item">
							<label>Email</label>
							<input
								type="email"
								value={editForm.email}
								onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
								className="form-input"
							/>
						</div>
						<div className="info-item">
							<label>First Name</label>
							<input
								type="text"
								value={editForm.firstName}
								onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
								className="form-input"
							/>
						</div>
						<div className="info-item">
							<label>Last Name</label>
							<input
								type="text"
								value={editForm.lastName}
								onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
								className="form-input"
							/>
						</div>
						<div className="info-item">
							<label>Phone Number</label>
							<input
								type="tel"
								value={editForm.phoneNumber}
								onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
								className="form-input"
							/>
						</div>
						<div className="info-item">
							<label>Avatar URL</label>
							<input
								type="url"
								value={editForm.avatarUrl}
								onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
								className="form-input"
							/>
						</div>
						<div className="info-item">
							<label>Address</label>
							<input
								type="text"
								value={editForm.address}
								onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
								className="form-input"
							/>
						</div>
						<button
							className="btn-primary"
							onClick={handleSaveUser}
							disabled={saving}
							style={{ marginTop: 20 }}
						>
							{saving ? "Saving..." : "Save User Info"}
						</button>
					</div>

					{((profile?.role || "").toUpperCase() === "OWNER") && (
						<div className="profile-section">
							<h2>Edit Owner Profile</h2>
							<div className="info-item">
								<label>About Me</label>
								<textarea
									value={ownerForm.aboutMe}
									onChange={(e) => setOwnerForm({ ...ownerForm, aboutMe: e.target.value })}
									className="form-input"
									rows="5"
								/>
							</div>
							<div className="info-item">
								<label>
									<input
										type="checkbox"
										checked={ownerForm.ownerVerified}
										onChange={(e) => setOwnerForm({ ...ownerForm, ownerVerified: e.target.checked })}
										style={{ marginRight: 10 }}
									/>
									Owner Verified
								</label>
							</div>
							<button
								className="btn-primary"
								onClick={handleSaveOwner}
								disabled={saving}
								style={{ marginTop: 20 }}
							>
								{saving ? "Saving..." : "Save Owner Profile"}
							</button>
						</div>
					)}

					{((profile?.role || "").toUpperCase() === "SITTER") && (
						<div className="profile-section">
							<h2>Edit Sitter Profile</h2>
							<div className="info-item">
								<label>Experience Summary</label>
								<textarea
									value={sitterForm.experienceSummary}
									onChange={(e) => setSitterForm({ ...sitterForm, experienceSummary: e.target.value })}
									className="form-input"
									rows="5"
								/>
							</div>
							<div className="info-item">
								<label>Average Rating</label>
								<input
									type="number"
									step="0.1"
									min="0"
									max="5"
									value={sitterForm.averageRating}
									onChange={(e) => setSitterForm({ ...sitterForm, averageRating: e.target.value })}
									className="form-input"
								/>
							</div>
							<div className="info-item">
								<label>Reviews Count</label>
								<input
									type="number"
									min="0"
									value={sitterForm.reviewsCount}
									onChange={(e) => setSitterForm({ ...sitterForm, reviewsCount: e.target.value })}
									className="form-input"
								/>
							</div>
							<div className="info-item">
								<label>
									<input
										type="checkbox"
										checked={sitterForm.sitterVerified}
										onChange={(e) => setSitterForm({ ...sitterForm, sitterVerified: e.target.checked })}
										style={{ marginRight: 10 }}
									/>
									Sitter Verified
								</label>
							</div>
							<button
								className="btn-primary"
								onClick={handleSaveSitter}
								disabled={saving}
								style={{ marginTop: 20 }}
							>
								{saving ? "Saving..." : "Save Sitter Profile"}
							</button>
						</div>
					)}
				</div>

				{((profile?.role || "").toUpperCase() === "OWNER") && (
					<div className="profile-section" style={{ marginTop: 30 }}>
						<h2>My Pets</h2>
						{loadingPets ? (
							<p>Loading pets...</p>
						) : (
							<>
								{pets.length > 0 ? (
									<div className="pets-list">
										{pets.map((pet) => (
											<div key={pet.slug || pet.id} className="pet-item">
												<h3>{pet.name}</h3>
												<p><strong>Species:</strong> {pet.species}</p>
												{pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
												{pet.age && <p><strong>Age:</strong> {pet.age}</p>}
												{pet.description && <p><strong>Description:</strong> {pet.description}</p>}
												<div style={{ marginTop: 10, display: "flex", gap: 10 }}>
													<button
														className="btn-secondary"
														onClick={() => startEditPet(pet)}
														style={{ fontSize: 12, padding: "8px 15px" }}
													>
														Edit
													</button>
													<button
														className="btn-danger"
														onClick={() => handleDeletePet(pet.slug)}
														style={{ fontSize: 12, padding: "8px 15px" }}
													>
														Delete
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									<p>No pets added yet.</p>
								)}
								{showPetForm ? (
									<div className="pet-form" style={{ marginTop: 20, padding: 20, background: "#f9f9f9", borderRadius: 10 }}>
										<h3>{editingPet ? "Edit Pet" : "Add New Pet"}</h3>
										<div className="info-item">
											<label>Name *</label>
											<input
												type="text"
												value={petForm.name}
												onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
												className="form-input"
												required
											/>
										</div>
										<div className="info-item">
											<label>Species *</label>
											<input
												type="text"
												value={petForm.species}
												onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
												className="form-input"
												required
											/>
										</div>
										<div className="info-item">
											<label>Breed</label>
											<input
												type="text"
												value={petForm.breed}
												onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
												className="form-input"
											/>
										</div>
										<div className="info-item">
											<label>Age</label>
											<input
												type="text"
												value={petForm.age}
												onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
												className="form-input"
											/>
										</div>
										<div className="info-item">
											<label>Description</label>
											<textarea
												value={petForm.description}
												onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
												className="form-input"
												rows="3"
											/>
										</div>
										<div style={{ display: "flex", gap: 10, marginTop: 15 }}>
											<button
												className="btn-primary"
												onClick={() => editingPet ? handleUpdatePet(editingPet.slug) : handleAddPet()}
											>
												{editingPet ? "Update Pet" : "Add Pet"}
											</button>
											<button
												className="btn-secondary"
												onClick={cancelEditPet}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<button
										className="btn-primary"
										onClick={() => setShowPetForm(true)}
										style={{ marginTop: 15 }}
									>
										Add New Pet
									</button>
								)}
							</>
						)}
					</div>
				)}

				{((profile?.role || "").toUpperCase() === "SITTER") && (
					<div className="profile-section" style={{ marginTop: 30 }}>
						<h2>Availability</h2>
						{loadingAvailability ? (
							<p>Loading availability...</p>
						) : (
							<div>
								<p style={{ marginBottom: 15, color: "#666" }}>
									Availability management will be implemented based on AvaliabilityDTO structure.
									Currently showing {availability.length} availability entries.
								</p>
								<button
									className="btn-primary"
									onClick={handleSaveAvailability}
									disabled={saving}
								>
									{saving ? "Saving..." : "Save Availability"}
								</button>
							</div>
						)}
					</div>
				)}

				<div className="profile-actions">
					<button
						className="btn-secondary"
						onClick={() => {
							setIsEditing(false);
							fetchProfile();
						}}
					>
						Cancel
					</button>
				</div>
			</>
		);
	}

	return (
		<div className="profile-page">
			<Header />
			
			<div className="profile-wrap">
				{loadingProfile ? (
					<div className="loading-state">
						<div className="spinner"></div>
						<p>{t('profile.loading','Loading profile...')}</p>
					</div>
				) : errorProfile ? (
					<div className="error-state">
						<div className="error-icon">⚠️</div>
						<p>{errorProfile}</p>
						<button className="btn-primary" onClick={fetchProfile} style={{ marginTop: 20 }}>
							{t('auth.try_again','Try again')}
						</button>
					</div>
				) : profile ? (
					<>
						<div className="profile-header">
							<div className="profile-avatar">
								{profile.avatarUrl || editForm.avatarUrl ? (
									<img src={profile.avatarUrl || editForm.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
								) : (
									getInitials(profile.name || profile.firstName, profile.email)
								)}
							</div>
							<h1>{profile.name || (profile.firstName ? `${profile.firstName} ${profile.lastName || ""}`.trim() : "") || profile.email || "Profile"}</h1>
							{(() => {
								let userRole = profile.role || profile.userRole;
								if (!userRole) {
									if (profile.owner || profile.ownerProfile) {
										userRole = "OWNER";
									} else if (profile.sitter || profile.sitterProfile) {
										userRole = "SITTER";
									}
								}
								return userRole ? (
									<div className={`role-label ${getRoleClass(userRole)}`}>
										{formatRole(userRole)}
									</div>
								) : null;
							})()}
						</div>

						{isEditing ? (
							renderEditForm()
						) : (
							<>
								<div className="profile-content">
									<div className="profile-section">
										<h2>Basic Information</h2>
										<div className="info-item">
											<label>Email</label>
											<div className="value">{profile.email || "—"}</div>
										</div>
										{profile.firstName && (
											<div className="info-item">
												<label>First Name</label>
												<div className="value">{profile.firstName}</div>
											</div>
										)}
										{profile.lastName && (
											<div className="info-item">
												<label>Last Name</label>
												<div className="value">{profile.lastName}</div>
											</div>
										)}
										{profile.name && (
											<div className="info-item">
												<label>Full Name</label>
												<div className="value">{profile.name}</div>
											</div>
										)}
										{(profile.phone || profile.phoneNumber) && (
											<div className="info-item">
												<label>Phone</label>
												<div className="value">{profile.phone || profile.phoneNumber}</div>
											</div>
										)}
										{profile.address && (
											<div className="info-item">
												<label>Address</label>
												<div className="value">{profile.address}</div>
											</div>
										)}
										{profile.role && (
											<div className="info-item">
												<label>Role</label>
												<div className="value">
													<span className={`role-badge ${getRoleClass(profile.role)}`}>
														{formatRole(profile.role)}
													</span>
												</div>
											</div>
										)}
									</div>

									<div className="profile-section">
										<h2>Additional Information</h2>
										{profile.id && (
											<div className="info-item">
												<label>User ID</label>
												<div className="value">{profile.id}</div>
											</div>
										)}
										{profile.createdAt && (
											<div className="info-item">
												<label>Registration Date</label>
												<div className="value">
													{new Date(profile.createdAt).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric"
													})}
												</div>
											</div>
										)}
										{profile.updatedAt && (
											<div className="info-item">
												<label>Last Updated</label>
												<div className="value">
													{new Date(profile.updatedAt).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric"
													})}
												</div>
											</div>
										)}
										{profile.bio && (
											<div className="info-item">
												<label>About</label>
												<div className="value">{profile.bio}</div>
											</div>
										)}
										{profile.location && (
											<div className="info-item">
												<label>Location</label>
												<div className="value">{profile.location}</div>
											</div>
										)}
										{(() => {
											const ownerData = profile.owner || profile.ownerProfile || {};
											const sitterData = profile.sitter || profile.sitterProfile || {};
											const role = (profile.role || "").toUpperCase();
											
											return (
												<>
													{role === "OWNER" && ownerData.aboutMe && (
														<div className="info-item">
															<label>About Me (Owner)</label>
															<div className="value">{ownerData.aboutMe}</div>
														</div>
													)}
													{role === "OWNER" && ownerData.ownerVerified !== undefined && (
														<div className="info-item">
															<label>Owner Verified</label>
															<div className="value">{ownerData.ownerVerified ? "Yes" : "No"}</div>
														</div>
													)}
													{role === "SITTER" && sitterData.experienceSummary && (
														<div className="info-item">
															<label>Experience Summary</label>
															<div className="value">{sitterData.experienceSummary}</div>
														</div>
													)}
													{role === "SITTER" && sitterData.averageRating !== undefined && (
														<div className="info-item">
															<label>Average Rating</label>
															<div className="value">{sitterData.averageRating}</div>
														</div>
													)}
													{role === "SITTER" && sitterData.reviewsCount !== undefined && (
														<div className="info-item">
															<label>Reviews Count</label>
															<div className="value">{sitterData.reviewsCount}</div>
														</div>
													)}
													{role === "SITTER" && sitterData.sitterVerified !== undefined && (
														<div className="info-item">
															<label>Sitter Verified</label>
															<div className="value">{sitterData.sitterVerified ? "Yes" : "No"}</div>
														</div>
													)}
												</>
											);
										})()}
									</div>
								</div>

								<div className="profile-actions">
									<button className="btn-primary" onClick={() => setIsEditing(true)}>
										Edit profile
									</button>
									<button className="btn-secondary" onClick={handleLogout}>
										Log out
									</button>
									<button className="btn-danger" onClick={handleDeleteAccount}>
										Delete account
									</button>
								</div>
							</>
						)}
					</>
				) : (
					<div className="error-state">
						<div className="error-icon">⚠️</div>
						<p>Profile not found</p>
						<button className="btn-primary" onClick={fetchProfile} style={{ marginTop: 20 }}>
							Try again
						</button>
					</div>
				)}
			</div>

			<Footer />
		</div>
	);
}