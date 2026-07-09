import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme, alpha } from "@mui/material/styles";

import Iconify from "src/components/common/iconify";
import { sweetAlertQuestion, sweetAlertSuccess } from "src/utils/sweet-alerts";

export default function NotesManager({ targetId, targetType, mockNotes = [] }) {
	const theme = useTheme();
	
	const [notes, setNotes] = useState(mockNotes);
	const [newNote, setNewNote] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedNote, setSelectedNote] = useState(null);
	
	const handleMenuClick = (event, note) => {
		setAnchorEl(event.currentTarget);
		setSelectedNote(note);
	};
	
	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedNote(null);
	};

	const handleAddNote = () => {
		if (!newNote.trim()) return;
		
		const note = {
			id: `NOTE-${Date.now()}`,
			adminName: "Current Admin", // In real app, from auth state
			content: newNote,
			date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
			isOwn: true
		};
		
		setNotes([note, ...notes]);
		setNewNote("");
		sweetAlertSuccess("Internal note added successfully.");
	};

	const handleDeleteNote = () => {
		if (!selectedNote) return;
		handleMenuClose();
		
		sweetAlertQuestion("Are you sure you want to delete this note? This action will be logged.", "Delete Note").then((result) => {
			if (result) {
				setNotes(notes.filter(n => n.id !== selectedNote.id));
				sweetAlertSuccess("Note deleted successfully.");
			}
		});
	};

	return (
		<Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Iconify icon="solar:document-add-bold-duotone" width={24} color={theme.palette.primary.main} />
					<Typography variant="h6" fontWeight="800">Internal Notes</Typography>
				</Stack>
				<Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>{notes.length} Notes</Typography>
			</Stack>
			
			<Divider sx={{ mb: 3 }} />
			
			{/* Add Note Input */}
			<Box sx={{ mb: 4 }}>
				<TextField
					fullWidth
					multiline
					rows={3}
					placeholder={`Add a secure internal note regarding ${targetType}...`}
					variant="outlined"
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					sx={{
						'& .MuiOutlinedInput-root': {
							borderRadius: 2,
							bgcolor: alpha(theme.palette.grey[500], 0.04),
							fontSize: '0.9rem',
						}
					}}
				/>
				<Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
					<Button 
						variant="contained" 
						color="primary" 
						size="small" 
						onClick={handleAddNote} 
						disabled={!newNote.trim()}
						startIcon={<Iconify icon="solar:plain-bold" />}
						sx={{ borderRadius: 8, px: 3, fontWeight: 700 }}
					>
						Post Note
					</Button>
				</Stack>
			</Box>
			
			{/* Notes Timeline */}
			<Stack spacing={3} sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
				{notes.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Iconify icon="solar:notes-minimalistic-line-duotone" width={48} sx={{ color: 'text.disabled', mb: 1 }} />
						<Typography variant="body2" color="text.secondary">No internal notes added yet.</Typography>
					</Box>
				) : (
					notes.map((note) => (
						<Box key={note.id} sx={{ position: 'relative' }}>
							<Stack direction="row" spacing={2}>
								<Avatar sx={{ width: 36, height: 36, bgcolor: note.isOwn ? theme.palette.primary.main : theme.palette.grey[400], fontSize: 14 }}>
									{note.adminName.charAt(0)}
								</Avatar>
								<Box sx={{ flex: 1 }}>
									<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
										<Box>
											<Typography variant="subtitle2" fontWeight="700">{note.adminName}</Typography>
											<Typography variant="caption" color="text.secondary">{note.date}</Typography>
										</Box>
										
										<IconButton size="small" onClick={(e) => handleMenuClick(e, note)}>
											<Iconify icon="solar:menu-dots-bold" width={18} />
										</IconButton>
									</Stack>
									
									<Box sx={{ mt: 1, p: 2, bgcolor: alpha(theme.palette.info.main, 0.04), borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
										<Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, color: 'text.secondary' }}>
											{note.content}
										</Typography>
									</Box>
								</Box>
							</Stack>
						</Box>
					))
				)}
			</Stack>
			
			{/* Note Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				PaperProps={{ sx: { width: 160, borderRadius: 2, mt: 1, boxShadow: '0px 5px 20px rgba(0,0,0,0.1)' } }}
			>
				<MenuItem onClick={handleMenuClose} sx={{fontSize: '0.85rem'}}><Iconify icon="solar:pen-bold" sx={{mr: 1.5}} width={16}/> Edit Note</MenuItem>
				<MenuItem onClick={handleDeleteNote} sx={{color: 'error.main', fontSize: '0.85rem'}}><Iconify icon="solar:trash-bin-trash-bold" sx={{mr: 1.5}} width={16}/> Delete Note</MenuItem>
			</Menu>
		</Card>
	);
}
